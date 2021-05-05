var graphs = [
    {
        key: 'a_b_pbx',
        name: 'A->B PBX',
        nodes: 'A,PBX,B',
        min_nodes: 2,
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
        name: 'A->C PBX Cancel',
        nodes: 'A,PBX,C',
        min_nodes: 2,
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
                label: '180 Ringing'
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
        nodes: 'A,PBX,Mobile',
        min_nodes: 3,
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
                label: 'INVITE',
                limit_nodes: 1
            },
            {
                type: 'response',
                label: '100 Trying',
                limit_nodes: 1
            },
            {
                type: 'response',
                label: '407 Requires Auth',
                limit_nodes: 1
            },
            {
                type: 'request',
                label: 'ACK',
                limit_nodes: 1
            },
            {
                type: 'request',
                label: 'INVITE (AUTH)',
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

export function getGraphRecipe(k) {
    return graphs.find(x => x.key === k);
}

export function generateGraphContent(k,n) {
    var allNames = n.split(',');

    if (allNames.length < 2) {
        throw "Not enough user names/nodes supplied.";
    }

    // All our diagrams are sequence diagrams in mermaid
    var content = `
sequenceDiagram
`;
    allNames.forEach(function(n) {
        content += "participant " + n + "\n";
    });

    var graphRecipe = getGraphRecipe(k);

    if (!graphRecipe) {
        throw "Unknown recipe " + k;
    }

    if (graphRecipe.min_nodes > allNames.length) {
        throw "Not enough nodes to draw graph, requires " + graphRecipe.min_nodes;
    }

    var sections = graphRecipe.sections;

    sections.forEach(function(s) {
        let names = allNames;
        if (s.hasOwnProperty('limit_nodes')) {
            // In the future if we want to do an offset this is the place.
            names = allNames.slice(0, s.limit_nodes+1);
        }

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


