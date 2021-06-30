/**
 * 'library' of SIP Call flows
 *
 * Library is a bit of a stretch as it's only a handful.
 *
 * Note that some are dynamically generated. These are the ones which have
 * `sections` instead of `static_content`. Originally I liked the idea of
 * making all of them dynamic but ran out of time. The dynamic ones allow
 * you to change the node names and also add in extra nodes. This might give
 * non-sensical results but it's kind of interesting.
 *
 */

var graphs = [
    {
        key: 'a_b_pbx',
        name: 'Standard Call (PBX)',
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
                label: '180 Ringing'
            },
            {
                type: 'response',
                label: '200 OK'
            },
            {
                type: 'request',
                label: 'ACK'
            },
            {
                type: 'note',
                label: 'Call is now in progress...'
            },
            {
                type: 'request',
                label: 'BYE'
            },
            {
                type: 'response',
                label: '200 OK'
            },
        ],
    },

    {
        key: 'a_b_pbx_2',
        name: 'Standard Call (Early Media) (PBX)',
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
                label: '183 Session Progress'
            },
            {
                type: 'note',
                label: 'Caller is now getting ringing (or other early media)'
            },
            {
                type: 'response',
                label: '200 OK'
            },
            {
                type: 'request',
                label: 'ACK'
            },
            {
                type: 'note',
                label: 'Call is now in progress...'
            },
            {
                type: 'request',
                label: 'BYE'
            },
            {
                type: 'response',
                label: '200 OK'
            },
        ],
    },

    {
        key: 'a_b_pbx_3',
        name: 'Standard Call (30 Second Broken) (PBX)',
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
                label: '183 Session Progress'
            },
            {
                type: 'response',
                label: '200 OK'
            },
            {
                type: 'note',
                // No ACK is sent - an ACK is only sent in
                //    response to a response to an INVITE request.
                label: 'Call is now in progress, but without an ACK the caller agent doesn\'t _know_.<br>'
                    + 'Usually 30 seconds grace for the ACK to arrive, otherwise tear down the call.'
            }
        ],
    },

    {
        key: 'a_b_pbx_cancel',
        name: 'Call with Cancel',
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
        name: 'Call with Auth Challenge',
        nodes: 'A,PBX,Mobile',
        min_nodes: 3,
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
                label: '180 Ringing'
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
        key: 'prack_example',
        name: 'PRACK Example',
        nodes: 'A,PBX,B',
        static_content: `
sequenceDiagram
participant A
participant PBX
participant B
Note over A, PBX: UDP with 100rel
A->>PBX: INVITE
PBX-->>A: 100 Trying
Note over PBX, B: TCP, so no 100rel
PBX->>B: INVITE
B-->>PBX: 100 Trying
B-->>PBX: 180 Ringing
PBX-->>A: 180 Ringing (Cseq n)
Note over A, B: A sends a requst to confirm it got the 180 Ringing
A->>PBX: PRACK (Rseq n)
PBX-->>A: 200 OK
B-->>PBX: 200 OK
PBX-->>A: 200 OK
A->>PBX: ACK
PBX->>B: ACK
Note over A, B: Call is now in progress...
A->>PBX: BYE
PBX->>B: BYE
B-->>PBX: 200 OK
PBX-->>A: 200 OK`,
        min_nodes: 4,
    },
    {
        key: 'blind_transfer_challenge',
        name: 'Blind Transfer',
        nodes: 'A,PBX,B,C',
        static_content: `
sequenceDiagram
participant A
participant PBX
participant B
participant C
A->>PBX: INVITE
PBX-->>A: 100 Trying
PBX->>B: INVITE
B-->>PBX: 100 Trying
B-->>PBX: 180 Ringing
PBX-->>A: 180 Ringing
B-->>PBX: 200 OK
PBX-->>A: 200 OK
A->>PBX: ACK
PBX->>B: ACK
Note over A, B: Call is now in progress...
B->>PBX: REFER
PBX-->>B: 202 Accepted
PBX->>C: INVITE
C-->>PBX: 100 Trying
Note over PBX, C: REFER creates an implicit subscription to the progress of the transfer.
PBX->>B: NOTIFY (100 Trying)
B-->>PBX: NOTIFY 200 OK
C-->>PBX: 180 Ringing
PBX->>B: NOTIFY (180 Ringing)
B-->>PBX: NOTIFY 200 OK
C-->>PBX: 200 OK
PBX->>C: ACK
PBX->>B: NOTIFY (200 OK)
B-->>PBX: NOTIFY 200 OK
Note over A, C: A and C are now connected,<br>The PBX can hang up on original B leg.
PBX->>B: BYE
B-->>PBX: 200 OK
Note over A, C: Sometime later A hangs up the call to C.
A->>PBX: BYE
PBX->>C: BYE
C-->>PBX: 200 OK
PBX-->>A: 200 OK`,
        min_nodes: 4,
    },
    {
        key: 'consult_transfer_challenge',
        name: 'Consult Transfer',
        nodes: 'A,PBX,B,C',
        static_content: `
sequenceDiagram
participant A
participant PBX
participant B
participant C
A->>PBX: INVITE
PBX-->>A: 100 Trying
PBX->>B: INVITE
B-->>PBX: 100 Trying
B-->>PBX: 180 Ringing
PBX-->>A: 180 Ringing
B-->>PBX: 200 OK
PBX-->>A: 200 OK
A->>PBX: ACK
PBX->>B: ACK
Note over A, B: Call is now in progress...
Note over A, B: B wants to consult with C, this is a brand new call
Note over A, B: B puts A on hold (with reINVITE, inactive media)
B->>PBX: INVITE
PBX->>A: INVITE
A-->>PBX: 200 OK
PBX-->>B: 200 OK
B->>PBX: ACK
PBX->>A: ACK
Note over A, B: B can now start consult leg
B->>PBX: INVITE
PBX-->>B: 100 Trying
PBX->>C: INVITE
C-->>PBX: 100 Trying
C-->>PBX: 180 Ringing
PBX-->>B: 180 Ringing
C-->>PBX: 200 OK
PBX-->>B: 200 OK
B->>PBX: ACK
PBX->>C: ACK
Note over PBX, C: Consult call now in progress
Note over PBX, C: C wants to take the call with A

B->>PBX: REFER (Refer-to: Replaces)
Note over PBX, C: Refer has 'replaces' so the PBX knows to merge the call with A
PBX-->>B: 202 Accepted
Note over A, C: A and C are now connected,<br>The PBX can hang up on original B leg.
PBX->>B: BYE
PBX-->>B: 200 OK
Note over A, C: Sometime later A hangs up the call to C.
A->>PBX: BYE
PBX->>C: BYE
C-->>PBX: 200 OK
PBX-->>A: 200 OK`,
        min_nodes: 4,
    },
    {
        key: 'register_auth_challenge',
        name: 'Register with Auth Challenge',
        nodes: 'A,PBX',
        min_nodes: 2,
        sections: [
            {
                type: 'request',
                label: 'REGISTER',
                limit_nodes: 1
            },
            {
                type: 'response',
                label: '407 Requires Auth',
                limit_nodes: 1
            },
            {
                type: 'note',
                label: '407 above will include a nonce to<br>'
                     + 'be used for generating auth header'
            },
            {
                type: 'request',
                label: 'REGISTER (AUTH)',
                limit_nodes: 1
            },
            {
                type: 'response',
                label: '200 OK',
                limit_nodes: 1
            },
            {
                type: 'note',
                label: 'No ACK required, ACKs only for INVITE.'
            },
        ],
    },
    {
        key: 'options',
        name: 'Options',
        nodes: 'A,PBX',
        min_nodes: 2,
        sections: [
            {
                type: 'note',
                label: 'OPTIONs often used for keep-alives'
            },
            {
                type: 'request',
                label: 'OPTIONS',
            },
            {
                type: 'response',
                label: '200 OK'
            },
            {
                type: 'note',
                label: 'No ACK required...'
            },
        ],
    },
    {
        key: 'unknown_number',
        name: 'Unknown Number (404)',
        nodes: 'A,PBX',
        static_content: `
sequenceDiagram
participant A
participant PBX
A->>PBX: INVITE
PBX-->>A: 100 Trying
PBX-->>A: 404 Not Found
Note over A, PBX: 404 typically means number was unknown
A->>PBX: ACK
`,
        min_nodes: 2,
    },
    {
        key: 'invalid_number',
        name: 'Forbidden Number (403)',
        nodes: 'A,PBX',
        static_content: `
sequenceDiagram
participant A
participant PBX
A->>PBX: INVITE
PBX-->>A: 100 Trying
PBX-->>A: 403 Forbidden
Note over A, PBX: Possibly high-cost number or unauth'd user
A->>PBX: ACK
`,
        min_nodes: 2,
    },
    {
        key: 'click_to_dial',
        name: 'Click-To-Dial',
        nodes: 'Dialer,PBX,B,C',
        static_content: `
sequenceDiagram
participant Dialer
participant PBX
participant B
participant C
Dialer->>PBX: INVITE
PBX-->>Dialer: 100 Trying
PBX->>B: INVITE
B-->>PBX: 100 Trying
B-->>PBX: 180 Ringing
PBX-->>Dialer: 180 Ringing
B-->>PBX: 200 OK
PBX-->>Dialer: 200 OK
Dialer->>PBX: ACK 
PBX->>B: ACK
Note over Dialer, B: First/main user connected, now ready for 'real' outbound leg
Note over Dialer, B: Click-to-dial typically sends REFER from same node as INVITE
Dialer->>PBX: REFER
PBX-->>Dialer: 202 Accepted
PBX->>C: INVITE
C-->>PBX: 100 Trying
Note over PBX, C: REFER's NOTIFY packets skipped on this diagram...
C-->>PBX: 180 Ringing
C-->>PBX: 200 OK
PBX->>C: ACK
Note over B, C: B and C are now connected,<br>The PBX can hang up on original dialer.
PBX->>Dialer: BYE
Dialer-->>PBX: 200 OK
Note over B, C: Sometime later B hangs up the call to C.
B->>PBX: BYE
PBX->>C: BYE
C-->>PBX: 200 OK
PBX-->>B: 200 OK`,
        min_nodes: 4,
    },
];

export function allGraphs() {
    return graphs;
}

export function getGraphRecipe(k) {
    return graphs.find(x => x.key === k);
}

export function generateGraphContent(k,n) {
    var graphRecipe = getGraphRecipe(k);

    if (!graphRecipe) {
        throw new Error("Unknown recipe " + k);
    }

    var content = '';
    if (graphRecipe.hasOwnProperty('static_content')) {
        content = graphRecipe.static_content;
    } else {
        content = generateGraphText(graphRecipe, n);
    }

    return {
        key: k,
        name: graphRecipe.name,
        content: content,
    }
}

function generateGraphText(graphRecipe, n) {
    var allNames = n.split(',');

    if (allNames.length < 2) {
        throw new Error("Not enough user names/nodes supplied.");
    }

    // All our diagrams are sequence diagrams in mermaid
    var content = `
sequenceDiagram
`;
    allNames.forEach(function(n) {
        content += "participant " + n + "\n";
    });

    if (graphRecipe.min_nodes > allNames.length) {
        throw new Error("Not enough nodes to draw graph, requires " + graphRecipe.min_nodes);
    }

    var sections = graphRecipe.sections;

    sections.forEach(function(s) {
        let names = allNames;
        if (s.hasOwnProperty('limit_nodes')) {
            let offset = 0;
            if (s.hasOwnProperty('offset')) {
                offset = s.offset;
            }
            let length = s.limit_nodes + 1 + offset;
            console.log("Length: ", length, "Offset: ", offset);
            names = allNames.slice(offset, length);
        }

        let pkt = '';

        let direction = (s.type === 'request' || s.type === 'note' ? 'forward' : 'backward');
        if (s.hasOwnProperty('direction')) {
            direction = s.direction;
        }
        let isFwd = direction === 'forward'; // bool helper

        let link = (s.type === 'request' ? '->>' : '-->>');
        if (s.hasOwnProperty('link')) {
            link = s.link;
        }

        /**
         * Special case 'notes', which stretch over all nodes
         **/
        if (s.type === 'note') {
            let startName = names[0];
            let endName = names[names.length - 1];
            content += "Note over " + startName + ", " + endName  + ": " + s.label + "\n";
            return;
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

    return content;
}


