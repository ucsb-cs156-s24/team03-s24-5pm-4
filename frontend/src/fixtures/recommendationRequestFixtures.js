const recommendationRequestFixtures = {
    oneRecommendationRequest:{
                "id": 1,
                "requesterEmail": "djensen2@outlook.com",
                "professorEmail": "pconrad@ucsb.edu",
                "explanation": "grad school",
                "dateRequested": "2024-04-05T08:00:00",

                "dateNeeded": "2024-04-10T08:00:00",

                "done": "false"
    },

    threeRecommendationRequests:
        [
            {
                "id": 2,
                "requesterEmail": "fakeemail@example.com",
                "professorEmail": "zmatni@ucsb.edu",
                "explanation": "masters program",
                "dateRequested": "2024-03-08T08:00:00",

                "dateNeeded": "2024-04-20T08:00:00",
              
                "done": "true"
            },
            {
                "id": 3,
                "requesterEmail": "fakeemail@example.edu",
                "professorEmail": "pconrad@ucsb.edu",
                "explanation": "phd program",
                "dateRequested": "2024-02-21T08:00:00",

                "dateNeeded": "2024-05-02T08:00:00",

                "done": "false"
            },
            {
                id: 4,
                "requesterEmail": "fakeemail@example.org",
                "professorEmail": "zmatni@ucsb.edu",
                "explanation": "postdoc letter",
                "dateRequested": "2024-01-01T08:00:00",

                "dateNeeded": "2024-06-12T08:00:00",
              
                "done": "false"
            },
        ]
}
export { recommendationRequestFixtures };