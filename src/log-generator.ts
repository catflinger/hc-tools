import { createPool, FieldInfo, MysqlError, Pool } from "mysql";

import { config } from "./log-config";

const sensorIds = ["28.0", "28.1", "28.2"];

export class LogGenerator {
    private pool: Pool = null;

    public deleteEntries(): Promise<any> {
        return this.openDatabase()
        .then(() => this.deleteReadings())
        .then(() => this.deleteControlStates());
    }

    public close(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.pool.end(() => resolve());
        });
    }

    public addEntries(date: Date): Promise<any> {

        let midnight: number = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0).getTime();
        let promises: Promise<boolean>[] = [];

        for (let t = 0; t < 6 * 24; t++) {

            promises.push(this.log(midnight, t));
        }

        return this.openDatabase()
        .then(() => Promise.all(promises));

    }

    private openDatabase(): Promise<void> {

        if (this.pool) {
            return Promise.resolve();
        } else {
            return new Promise((resolve, reject) => {
                try {
                    this.pool = createPool({
                        connectionLimit: 5,
                        database: config.database,
                        host: config.server,
                        password: config.password,
                        user: config.user,
                    });

                    resolve();
                } catch (err) {
                    reject(err);
                }
            });
        }
    }

    public log(midnight: number, t: number): Promise<boolean> {
        const secondsPerMinute = 60;
        const milliSecondsBetweenRecords = 10 * secondsPerMinute * 1000;

        let success = true;

        let logDate: number = midnight + t * milliSecondsBetweenRecords;

        return this.insertControlState(this.pool, logDate, t < 10, t > 100)

            .then(() => {
                const promises: Array<Promise<void>> = [];

                sensorIds.forEach((s, index) => {
                    promises.push(this.insertReading(this.pool, logDate, s, 210 + index * 20 + 50 * Math.sin(t / 20)));
                });

                return Promise.all(promises);
            })
            .catch((error: any) => {
                success = false;
            })
            .then(() => {
                return Promise.resolve(success);
            });
    }

    private insertControlState(pool: Pool, date: number, heating: boolean, hw: boolean): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            pool.query("INSERT IGNORE INTO control_state (date, heating, hw) VALUES (?,?,?)", [date, heating, hw], (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }

    private insertReading(pool: Pool, date: number, id: string, reading: number): Promise<void> {
        return new Promise((resolve, reject) => {
            pool.query("INSERT IGNORE INTO reading (date, sensor_id, reading) VALUES (?,?, ?)", [date, id, reading], (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }

    private deleteReadings(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.pool.query("DELETE FROM reading", null, (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }
    private deleteControlStates(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.pool.query("DELETE FROM control_state", [], (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }
}