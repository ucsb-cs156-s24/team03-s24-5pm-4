const helpRequestFixtures = {
    oneHelpRequest: {
        "id": 1,
        "requesterEmail": "jason_rodrigues@ucsb.edu",
        "teamId": "5pm-4",
        "tableOrBreakoutRoom": "Table 12",
        "requestTime": "2022-01-02T12:00:00",
        "explanation": "Issues",
        "solved": true
    },
    threeHelpRequests: [
        {
            "id": 1,
            "requesterEmail": "example1@ucsb.edu",
            "teamId": "5pm-41",
            "tableOrBreakoutRoom": "1",
            "requestTime": "2022-01-02T12:00:00",
            "explanation": "Issues",
            "solved": true
        },
        {
            "id": 2,
            "requesterEmail": "example2@ucsb.edu",
            "teamId": "5pm-42",
            "tableOrBreakoutRoom": "2",
            "requestTime": "2023-01-02T12:00:00",
            "explanation": "Bugs",
            "solved": true
        },
        {
            "id": 3,
            "requesterEmail": "example@ucsb.edu",
            "teamId": "5pm-43",
            "tableOrBreakoutRoom": "3",
            "requestTime": "2024-01-02T12:00:00",
            "explanation": "Broken",
            "solved": true
        }
    ]
};


export { helpRequestFixtures };