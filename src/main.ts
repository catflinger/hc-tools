import commandLineArgs from "command-line-args";

import { LogGenerator } from "./log-generator";

const optionDefinitions = [
    { name: 'command', alias: 'c', type: String }
]

try {

    const args = commandLineArgs(optionDefinitions);

    if (!args.command) {
        console.log("command missing - specify using -c COMMAND");
    } else {
        switch (args.command) {
            case "log":
                console.log("Generating logs");
                const logGen = new LogGenerator();

                logGen.deleteEntries()
                    .then(() => logGen.addEntries(new Date()))
                    .then(() => console.log("Finished"))
                    .then(() => logGen.close());

                break;

            default:
                console.log("unrecognised command " + args.command);
        }
    }

} catch (e) {
    console.log("An error occurred:  " + e);
}
