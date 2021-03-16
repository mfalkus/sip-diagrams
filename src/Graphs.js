var graphs = [
    {
        key: 'a_b_pbx',
        name: 'A->B PBX',
        content: `
sequenceDiagram
participant Phone A
participant PBX
participant Phone B
Phone A->>PBX: INVITE
PBX->>Phone B: INVITE
Phone B-->>PBX: 100 Trying
PBX-->>Phone A: 100 Trying
Phone B-->>PBX: 180 Ringing
PBX-->>Phone A: 180 Ringing
Phone B-->>PBX: 200 OK
PBX-->>Phone A: 200 OK
Phone A->>PBX: ACK
PBX->>Phone B: ACK
`
    },

    {
        key: 'a_b_pbx_cancel',
        name: 'A->B PBX Cancel',
        content: `
sequenceDiagram
participant Phone A
participant PBX
participant Phone B
Phone A->>PBX: INVITE
PBX->>Phone B: INVITE
Phone B-->>PBX: 100 Trying
PBX-->>Phone A: 100 Trying
Phone A->>PBX: CANCEL
PBX->>Phone B: CANCEL
Phone B-->>PBX: 200 OK (CANCEL)
PBX-->>Phone A: 200 OK (CANCEL)
Phone B-->>PBX: 487 (INVITE)
PBX-->>Phone A: 487 (INVITE)
Phone A->>PBX: ACK
PBX->>Phone B: ACK
`
    },
    {
        key: 'auth_challenge',
        name: 'Auth Challenge',
        content: `
sequenceDiagram
participant Phone A
participant PBX
Phone A->>PBX: INVITE
PBX-->>Phone A: 100 Trying
PBX-->>Phone A: 407 Auth Required
Phone A->>PBX: ACK
Note over PBX, Phone A: New CSEQ, WWW-Auth header
Phone A->>PBX: INVITE (AUTH)
PBX-->>Phone A: 100 Trying
PBX-->>Phone A: 180 Ringing
Note over PBX, Phone A: Call continues as normal
`
    },
];

export function allGraphs() {
    return graphs;
}

export function graphContent(k) {
    return graphs.find(x => x.key === k);
}
