var graphs = [
    {
        key: 'a_b_pbx',
        name: 'A->B PBX',
        sampleContent: `
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
`,
        sections: [
            {
                type: 'request',
                label: 'INVITE'
            },
            {
                type: 'response',
                label: '100 Trying'
            },
            {
                type: 'response',
                label: '180 Trying'
            },
            {
                type: 'response',
                label: '200 OK'
            },
            {
                type: 'request',
                label: 'ACK'
            },
        ],
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
`,
        sections: [
            {
                type: 'request',
                label: 'INVITE'
            },
            {
                type: 'response',
                label: '100 Trying'
            },
            {
                type: 'request',
                label: 'CANCEL'
            },
            {
                type: 'response',
                label: '200 OK (CANCEL)'
            },
            {
                type: 'response',
                label: '487 (INVITE)',
            },
            {
                type: 'request',
                label: 'ACK'
            },
        ],
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
`,
        sections: [
            {
                type: 'request',
                label: 'INVITE'
            },
            {
                type: 'response',
                label: '100 Trying'
            },
            {
                type: 'response',
                label: '180 Trying'
            },
            {
                type: 'response',
                label: '200 OK'
            },
            {
                type: 'request',
                label: 'ACK'
            },
        ],
    },
];

export function allGraphs() {
    return graphs;
}

export function graphContent(k) {
    return graphs.find(x => x.key === k);
}

export function generateGraphContent(k,n) {
    var names = n.split(',');

    if (names.length < 2) {
        throw "Not enough user names/nodes supplied.";
    }

    // All our diagrams are sequence diagrams in mermaid
    var content = `
sequenceDiagram
`;
    names.forEach(function(n) {
        content += "participant " + n + "\n";
    });

    var graphRecipe = graphContent(k);

    if (!graphRecipe) {
        throw "Unknown recipe " + k;
    }

    var sections = graphRecipe.sections;

    sections.forEach(function(s) {
        let pkt = '';

        let direction = (s.type === 'request' ? 'forward' : 'backward');
        if (s.hasOwnProperty('direction')) {
            direction = s.direction;
        }
        let isFwd = direction === 'forward'; // bool helper

        let link = (s.type === 'request' ? '->>' : '-->>');
        if (s.hasOwnProperty('link')) {
            link = s.link;
        }

        // Set first pair of names manually so loop is clean
        let startName;
        let endName = (isFwd ? names[0] : names[names.length - 1]);

        /**
         * This looks a little funky, but if we have a list of nodes, we either want
         * to go 'forward' (left to right), or 'backward' (right to left), so we need
         * to be able to loop through in either direction
         **/
        for (
            let i = (isFwd ? 1 : names.length - 2);
            (isFwd ? i < names.length : i >= 0);
            (isFwd ? i++ : i--)
        ){
            startName = endName;
            endName = names[i];

            pkt += startName + link + endName + ': ' + s.label + "\n";
        }

        content += pkt;
    });

    return {
        key: 'auth_challenge',
        name: 'Auth Challenge',
        content: content,
    }
}


