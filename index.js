var ffi = require('ffi');
var ref = require('ref');

const pszErrors = [
    "Okay",
    "Attempt to Open when already Open",
    "Cannot link to FSUIPC or WideClient",
    "Failed to Register common message with Windows",
    "Failed to create Atom for mapping filename",
    "Failed to create a file mapping object",
    "Failed to open a view to the file map",
    "Incorrect version of FSUIPC, or not FSUIPC",
    "Sim is not version requested",
    "Call cannot execute, link not Open",
    "Call cannot execute: no requests accumulated",
    "IPC timed out all retries",
    "IPC sendmessage failed all retries",
    "IPC request contains bad data",
    "Maybe running on WideClient, but FS not running on Server, or wrong FSUIPC",
    "Read or Write request cannot be added, memory for Process is full",
];
// Creates a DWORD pointer
const DWORDPTR = ref.refType('ulong');
// Creates a void pointer
const VOIDPTR = ref.types.void;
const byte = ref.types.byte;

const fsuipc = ffi.Library('FSUIPCFFI', {
    'FSUIPC_Open': [byte, ['ulong', DWORDPTR]],
    'FSUIPC_Read': ['byte', ['ulong', 'ulong', VOIDPTR, DWORDPTR]],
    'FSUIPC_Process': ['byte', [DWORDPTR]]
});
var dwResult = ref.alloc('ulong');

if (fsuipc.FSUIPC_Open(2, dwResult)) {
    console.log("OK");
    var chTime = ref.alloc('ulong');
    if (!fsuipc.FSUIPC_Read(0x238, 3, chTime, dwResult) || !fsuipc.FSUIPC_Process(dwResult)) {
        console.log(chTime.deref());
    }
} else {
    console.log("Error FSUIPC_Open - " + pszErrors[dwResult.deref()]);
}
