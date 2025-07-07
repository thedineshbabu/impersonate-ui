

export interface BusinessUnit {
  name: string;
  accessEnabled: boolean;
}

export interface KfPayAttributes {
  marketInsights?: string;
  rewardHealthcheck?: string;
  rewardBenchmarking?: string;
  compensationBenefitsReport?: string;
  genderAnalysis?: boolean;
  accessByLevel?: string;
  kfPayReferenceLevel?: string;
  otherReports?: string;
  accessbyLevel: boolean;
  accessLevel: string | null;
  referenceLevel: string | null;
  businessUnits: BusinessUnit[] | null;
}

export interface CountryKfPayAttributes {
  country: string;
  attributes: KfPayAttributes;
}

export interface User {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  teamId?: string;
  kfPayAttributes?: CountryKfPayAttributes[];
}

export interface Team {
  teamId: string;
  name: string;
  description: string;
  members: string[]; // Array of userIds
}

export interface Client {
  id: string;
  name: string;
  subscribedProducts: string[];
  users: User[];
  teams: Team[];
}

export const clientData = {
  "clients": [
    {
      "id": "1a2b3c4d-1234-5678-9abc-def012345678",
      "name": "Acme Corporation",
      "subscribedProducts": ["Pay & Markets", "Assess", "KF Architect", "Profile Manager"],
      "teams": [
        {
          "teamId": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
          "name": "Profile User",
          "description": "Users with access to profile features",
          "members": ["550e8400-e29b-41d4-a716-446655440001", "550e8400-e29b-41d4-a716-446655440002", "550e8400-e29b-41d4-a716-446655440028", "550e8400-e29b-41d4-a716-446655440029"]
        },
        {
          "teamId": "6ba7b811-9dad-11d1-80b4-00c04fd430c8",
          "name": "Super Admin",
          "description": "System administrators with full access and control",
          "members": ["550e8400-e29b-41d4-a716-446655440003", "550e8400-e29b-41d4-a716-446655440030"]
        },
        {
          "teamId": "6ba7b812-9dad-11d1-80b4-00c04fd430c9",
          "name": "Tableau User",
          "description": "Users with access to Tableau dashboards",
          "members": ["550e8400-e29b-41d4-a716-446655440020", "550e8400-e29b-41d4-a716-446655440031"]
        },
        {
          "teamId": "6ba7b813-9dad-11d1-80b4-00c04fd430c9",
          "name": "Client User",
          "description": "Standard client users with basic access",
          "members": ["550e8400-e29b-41d4-a716-446655440021", "550e8400-e29b-41d4-a716-446655440032"]
        },
        {
          "teamId": "6ba7b814-9dad-11d1-80b4-00c04fd430c9",
          "name": "Listen Admin",
          "description": "Administrators for Listen features",
          "members": ["550e8400-e29b-41d4-a716-446655440022", "550e8400-e29b-41d4-a716-446655440033"]
        },
        {
          "teamId": "6ba7b815-9dad-11d1-80b4-00c04fd430c9",
          "name": "Client Admin",
          "description": "Client administrators with elevated permissions",
          "members": ["550e8400-e29b-41d4-a716-446655440023", "550e8400-e29b-41d4-a716-446655440034"]
        },
        {
          "teamId": "6ba7b816-9dad-11d1-80b4-00c04fd430c9",
          "name": "Profile Manager Admin",
          "description": "Administrators for Profile Manager features",
          "members": ["550e8400-e29b-41d4-a716-446655440024", "550e8400-e29b-41d4-a716-446655440035"]
        },
        {
          "teamId": "6ba7b817-9dad-11d1-80b4-00c04fd430c9",
          "name": "Listen User",
          "description": "Users with access to Listen features",
          "members": ["550e8400-e29b-41d4-a716-446655440025", "550e8400-e29b-41d4-a716-446655440036"]
        },
        {
          "teamId": "6ba7b818-9dad-11d1-80b4-00c04fd430c9",
          "name": "Tableau Admin",
          "description": "Administrators for Tableau dashboards",
          "members": ["550e8400-e29b-41d4-a716-446655440026", "550e8400-e29b-41d4-a716-446655440037"]
        },
        {
          "teamId": "6ba7b819-9dad-11d1-80b4-00c04fd430c9",
          "name": "Client User",
          "description": "Standard client users with basic access",
          "members": ["550e8400-e29b-41d4-a716-446655440027", "550e8400-e29b-41d4-a716-446655440038"]
        }
      ],
      "users": [
        {
          "userId": "550e8400-e29b-41d4-a716-446655440001",
          "email": "alice.smith@acme.com",
          "firstName": "Alice",
          "lastName": "Smith",
          "teamId": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
          "kfPayAttributes": [
            {
              "country": "United States",
              "attributes": {
                "marketInsights": "Access",
                "rewardHealthcheck": "Access by Level",
                "rewardBenchmarking": "Access by Level",
                "compensationBenefitsReport": "Access",
                "genderAnalysis": false,
                "accessByLevel": "Access Non-Exec Only",
                "kfPayReferenceLevel": "Level 36 (11181 - 12980)",
                "otherReports": "Access",
                "accessbyLevel": true,
                "accessLevel": "Non Executive",
                "referenceLevel": "Level 15",
                "businessUnits": [
                  {
                    "name": "Engineering Division",
                    "accessEnabled": true
                  },
                  {
                    "name": "Product Development",
                    "accessEnabled": true
                  }
                ]
              }
            },
            {
              "country": "Canada",
              "attributes": {
                "accessbyLevel": true,
                "accessLevel": "Non Executive",
                "referenceLevel": "Level 15",
                "businessUnits": [
                  {
                    "name": "Engineering Division",
                    "accessEnabled": true
                  }
                ]
              }
            }
          ]
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440002",
          "email": "bob.jones@acme.com",
          "firstName": "Bob",
          "lastName": "Jones",
          "teamId": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
          "kfPayAttributes": [
            {
              "country": "United States",
              "attributes": {
                "accessbyLevel": true,
                "accessLevel": "Non Executive",
                "referenceLevel": "Level 20",
                "businessUnits": [
                  {
                    "name": "Engineering Division",
                    "accessEnabled": true
                  },
                  {
                    "name": "Infrastructure Team",
                    "accessEnabled": true
                  }
                ]
              }
            },
            {
              "country": "Germany",
              "attributes": {
                "accessbyLevel": false,
                "accessLevel": null,
                "referenceLevel": null,
                "businessUnits": null
              }
            }
          ]
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440003",
          "email": "claire.white@acme.com",
          "firstName": "Claire",
          "lastName": "White",
          "teamId": "6ba7b811-9dad-11d1-80b4-00c04fd430c8",
          "kfPayAttributes": [
            {
              "country": "United States",
              "attributes": {
                "accessbyLevel": true,
                "accessLevel": "Executive",
                "referenceLevel": "Level 35",
                "businessUnits": [
                  {
                    "name": "Product Management",
                    "accessEnabled": true
                  },
                  {
                    "name": "Strategy Division",
                    "accessEnabled": true
                  },
                  {
                    "name": "Executive Office",
                    "accessEnabled": true
                  }
                ]
              }
            }
          ]
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440020",
          "email": "sarah.designer@acme.com",
          "firstName": "Sarah",
          "lastName": "Designer",
          "teamId": "6ba7b812-9dad-11d1-80b4-00c04fd430c9"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440021",
          "email": "mike.tester@acme.com",
          "firstName": "Mike",
          "lastName": "Tester",
          "teamId": "6ba7b813-9dad-11d1-80b4-00c04fd430c9"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440022",
          "email": "devops.jenkins@acme.com",
          "firstName": "DevOps",
          "lastName": "Jenkins",
          "teamId": "6ba7b814-9dad-11d1-80b4-00c04fd430c9"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440023",
          "email": "marketing.anna@acme.com",
          "firstName": "Anna",
          "lastName": "Marketing",
          "teamId": "6ba7b815-9dad-11d1-80b4-00c04fd430c9"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440024",
          "email": "sales.john@acme.com",
          "firstName": "John",
          "lastName": "Sales",
          "teamId": "6ba7b816-9dad-11d1-80b4-00c04fd430c9"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440025",
          "email": "support.lisa@acme.com",
          "firstName": "Lisa",
          "lastName": "Support",
          "teamId": "6ba7b817-9dad-11d1-80b4-00c04fd430c9"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440026",
          "email": "finance.carlos@acme.com",
          "firstName": "Carlos",
          "lastName": "Finance",
          "teamId": "6ba7b818-9dad-11d1-80b4-00c04fd430c9"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440027",
          "email": "legal.maria@acme.com",
          "firstName": "Maria",
          "lastName": "Legal",
          "teamId": "6ba7b819-9dad-11d1-80b4-00c04fd430c9"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440028",
          "email": "developer.tom@acme.com",
          "firstName": "Tom",
          "lastName": "Developer",
          "teamId": "6ba7b810-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440029",
          "email": "architect.jane@acme.com",
          "firstName": "Jane",
          "lastName": "Architect",
          "teamId": "6ba7b810-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440030",
          "email": "analyst.david@acme.com",
          "firstName": "David",
          "lastName": "Analyst",
          "teamId": "6ba7b811-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440031",
          "email": "designer.emma@acme.com",
          "firstName": "Emma",
          "lastName": "Designer",
          "teamId": "6ba7b812-9dad-11d1-80b4-00c04fd430c9"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440032",
          "email": "tester.sophia@acme.com",
          "firstName": "Sophia",
          "lastName": "Tester",
          "teamId": "6ba7b813-9dad-11d1-80b4-00c04fd430c9"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440033",
          "email": "engineer.alex@acme.com",
          "firstName": "Alex",
          "lastName": "Engineer",
          "teamId": "6ba7b814-9dad-11d1-80b4-00c04fd430c9"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440034",
          "email": "specialist.rachel@acme.com",
          "firstName": "Rachel",
          "lastName": "Specialist",
          "teamId": "6ba7b815-9dad-11d1-80b4-00c04fd430c9"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440035",
          "email": "manager.kevin@acme.com",
          "firstName": "Kevin",
          "lastName": "Manager",
          "teamId": "6ba7b816-9dad-11d1-80b4-00c04fd430c9"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440036",
          "email": "coordinator.amy@acme.com",
          "firstName": "Amy",
          "lastName": "Coordinator",
          "teamId": "6ba7b817-9dad-11d1-80b4-00c04fd430c9"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440037",
          "email": "advisor.michael@acme.com",
          "firstName": "Michael",
          "lastName": "Advisor",
          "teamId": "6ba7b818-9dad-11d1-80b4-00c04fd430c9"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440038",
          "email": "counsel.jessica@acme.com",
          "firstName": "Jessica",
          "lastName": "Counsel",
          "teamId": "6ba7b819-9dad-11d1-80b4-00c04fd430c9"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440039",
          "email": "analyst.robert@acme.com",
          "firstName": "Robert",
          "lastName": "Analyst",
          "teamId": "6ba7b810-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440040",
          "email": "coordinator.lisa@acme.com",
          "firstName": "Lisa",
          "lastName": "Coordinator",
          "teamId": "6ba7b811-9dad-11d1-80b4-00c04fd430c8"
        }
      ]
    },
    {
      "id": "2b3c4d5e-2345-6789-abcd-ef1234567890",
      "name": "Beta Enterprises",
      "subscribedProducts": ["Profile Manager", "Pay Equity", "KF Architect"],
      "teams": [
        {
          "teamId": "6ba7b812-9dad-11d1-80b4-00c04fd430c8",
          "name": "Super Admin",
          "description": "System administrators with full access and control",
          "members": ["550e8400-e29b-41d4-a716-446655440004", "550e8400-e29b-41d4-a716-446655440005", "550e8400-e29b-41d4-a716-446655440041", "550e8400-e29b-41d4-a716-446655440042", "550e8400-e29b-41d4-a716-446655440044", "550e8400-e29b-41d4-a716-446655440045", "550e8400-e29b-41d4-a716-446655440047", "550e8400-e29b-41d4-a716-446655440049", "550e8400-e29b-41d4-a716-446655440050", "550e8400-e29b-41d4-a716-446655440052", "550e8400-e29b-41d4-a716-446655440054", "550e8400-e29b-41d4-a716-446655440056", "550e8400-e29b-41d4-a716-446655440057", "550e8400-e29b-41d4-a716-446655440059"]
        },
        {
          "teamId": "6ba7b813-9dad-11d1-80b4-00c04fd430c8",
          "name": "Client Admin",
          "description": "Client administrators with elevated permissions",
          "members": ["550e8400-e29b-41d4-a716-446655440006", "550e8400-e29b-41d4-a716-446655440043", "550e8400-e29b-41d4-a716-446655440046", "550e8400-e29b-41d4-a716-446655440048", "550e8400-e29b-41d4-a716-446655440051", "550e8400-e29b-41d4-a716-446655440053", "550e8400-e29b-41d4-a716-446655440055", "550e8400-e29b-41d4-a716-446655440058", "550e8400-e29b-41d4-a716-446655440060"]
        }
      ],
      "users": [
        {
          "userId": "550e8400-e29b-41d4-a716-446655440004",
          "email": "daniel.brown@beta.com",
          "firstName": "Daniel",
          "lastName": "Brown",
          "teamId": "6ba7b812-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440005",
          "email": "emma.james@beta.com",
          "firstName": "Emma",
          "lastName": "James",
          "teamId": "6ba7b812-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440006",
          "email": "felix.miller@beta.com",
          "firstName": "Felix",
          "lastName": "Miller",
          "teamId": "6ba7b813-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440041",
          "email": "manager.sarah@beta.com",
          "firstName": "Sarah",
          "lastName": "Manager",
          "teamId": "6ba7b812-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440042",
          "email": "specialist.mike@beta.com",
          "firstName": "Mike",
          "lastName": "Specialist",
          "teamId": "6ba7b812-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440043",
          "email": "coordinator.anna@beta.com",
          "firstName": "Anna",
          "lastName": "Coordinator",
          "teamId": "6ba7b813-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440044",
          "email": "analyst.david@beta.com",
          "firstName": "David",
          "lastName": "Analyst",
          "teamId": "6ba7b812-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440045",
          "email": "associate.emma@beta.com",
          "firstName": "Emma",
          "lastName": "Associate",
          "teamId": "6ba7b812-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440046",
          "email": "consultant.james@beta.com",
          "firstName": "James",
          "lastName": "Consultant",
          "teamId": "6ba7b813-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440047",
          "email": "director.maria@beta.com",
          "firstName": "Maria",
          "lastName": "Director",
          "teamId": "6ba7b812-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440048",
          "email": "executive.carlos@beta.com",
          "firstName": "Carlos",
          "lastName": "Executive",
          "teamId": "6ba7b813-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440049",
          "email": "lead.rachel@beta.com",
          "firstName": "Rachel",
          "lastName": "Lead",
          "teamId": "6ba7b812-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440050",
          "email": "senior.kevin@beta.com",
          "firstName": "Kevin",
          "lastName": "Senior",
          "teamId": "6ba7b812-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440051",
          "email": "principal.amy@beta.com",
          "firstName": "Amy",
          "lastName": "Principal",
          "teamId": "6ba7b813-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440052",
          "email": "strategist.michael@beta.com",
          "firstName": "Michael",
          "lastName": "Strategist",
          "teamId": "6ba7b812-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440053",
          "email": "coordinator.jessica@beta.com",
          "firstName": "Jessica",
          "lastName": "Coordinator",
          "teamId": "6ba7b813-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440054",
          "email": "manager.thomas@beta.com",
          "firstName": "Thomas",
          "lastName": "Manager",
          "teamId": "6ba7b812-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440055",
          "email": "specialist.laura@beta.com",
          "firstName": "Laura",
          "lastName": "Specialist",
          "teamId": "6ba7b813-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440056",
          "email": "analyst.steven@beta.com",
          "firstName": "Steven",
          "lastName": "Analyst",
          "teamId": "6ba7b812-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440057",
          "email": "associate.nicole@beta.com",
          "firstName": "Nicole",
          "lastName": "Associate",
          "teamId": "6ba7b812-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440058",
          "email": "consultant.ryan@beta.com",
          "firstName": "Ryan",
          "lastName": "Consultant",
          "teamId": "6ba7b813-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440059",
          "email": "director.ashley@beta.com",
          "firstName": "Ashley",
          "lastName": "Director",
          "teamId": "6ba7b812-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440060",
          "email": "executive.brandon@beta.com",
          "firstName": "Brandon",
          "lastName": "Executive",
          "teamId": "6ba7b813-9dad-11d1-80b4-00c04fd430c8"
        }
      ]
    },
    {
      "id": "3c4d5e6f-3456-789a-bcde-f12345678901",
      "name": "Gamma Group",
      "subscribedProducts": ["Pay & Markets", "Profile Manager", "Assess", "Pay Equity", "KF Architect"],
      "teams": [
        {
          "teamId": "6ba7b814-9dad-11d1-80b4-00c04fd430c8",
          "name": "Research & Development",
          "description": "Innovation and product development",
          "members": ["550e8400-e29b-41d4-a716-446655440007", "550e8400-e29b-41d4-a716-446655440008", "550e8400-e29b-41d4-a716-446655440061", "550e8400-e29b-41d4-a716-446655440062", "550e8400-e29b-41d4-a716-446655440063", "550e8400-e29b-41d4-a716-446655440064", "550e8400-e29b-41d4-a716-446655440067", "550e8400-e29b-41d4-a716-446655440069", "550e8400-e29b-41d4-a716-446655440071", "550e8400-e29b-41d4-a716-446655440073", "550e8400-e29b-41d4-a716-446655440075", "550e8400-e29b-41d4-a716-446655440077", "550e8400-e29b-41d4-a716-446655440079"]
        },
        {
          "teamId": "6ba7b815-9dad-11d1-80b4-00c04fd430c8",
          "name": "Human Resources",
          "description": "Employee management and organizational development",
          "members": ["550e8400-e29b-41d4-a716-446655440009", "550e8400-e29b-41d4-a716-446655440010", "550e8400-e29b-41d4-a716-446655440065", "550e8400-e29b-41d4-a716-446655440066", "550e8400-e29b-41d4-a716-446655440068", "550e8400-e29b-41d4-a716-446655440070", "550e8400-e29b-41d4-a716-446655440072", "550e8400-e29b-41d4-a716-446655440074", "550e8400-e29b-41d4-a716-446655440076", "550e8400-e29b-41d4-a716-446655440078", "550e8400-e29b-41d4-a716-446655440080"]
        }
      ],
      "users": [
        {
          "userId": "550e8400-e29b-41d4-a716-446655440007",
          "email": "grace.lee@gamma.com",
          "firstName": "Grace",
          "lastName": "Lee",
          "teamId": "6ba7b814-9dad-11d1-80b4-00c04fd430c8",
          "kfPayAttributes": [
            {
              "country": "United Kingdom",
              "attributes": {
                "accessbyLevel": true,
                "accessLevel": "Non Executive",
                "referenceLevel": "Level 12",
                "businessUnits": [
                  {
                    "name": "R&D Division",
                    "accessEnabled": true
                  },
                  {
                    "name": "Innovation Lab",
                    "accessEnabled": true
                  }
                ]
              }
            },
            {
              "country": "France",
              "attributes": {
                "accessbyLevel": true,
                "accessLevel": "Non Executive",
                "referenceLevel": "Level 12",
                "businessUnits": [
                  {
                    "name": "R&D Division",
                    "accessEnabled": true
                  }
                ]
              }
            }
          ]
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440008",
          "email": "henry.turner@gamma.com",
          "firstName": "Henry",
          "lastName": "Turner",
          "teamId": "6ba7b814-9dad-11d1-80b4-00c04fd430c8",
          "kfPayAttributes": [
            {
              "country": "United Kingdom",
              "attributes": {
                "accessbyLevel": true,
                "accessLevel": "Non Executive",
                "referenceLevel": "Level 22",
                "businessUnits": [
                  {
                    "name": "R&D Division",
                    "accessEnabled": true
                  },
                  {
                    "name": "Advanced Projects",
                    "accessEnabled": true
                  }
                ]
              }
            },
            {
              "country": "Italy",
              "attributes": {
                "accessbyLevel": false,
                "accessLevel": null,
                "referenceLevel": null,
                "businessUnits": null
              }
            }
          ]
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440009",
          "email": "isabel.king@gamma.com",
          "firstName": "Isabel",
          "lastName": "King",
          "teamId": "6ba7b815-9dad-11d1-80b4-00c04fd430c8",
          "kfPayAttributes": [
            {
              "country": "United Kingdom",
              "attributes": {
                "accessbyLevel": true,
                "accessLevel": "Non Executive",
                "referenceLevel": "Level 25",
                "businessUnits": [
                  {
                    "name": "Human Resources",
                    "accessEnabled": true
                  },
                  {
                    "name": "Talent Acquisition",
                    "accessEnabled": true
                  },
                  {
                    "name": "Employee Relations",
                    "accessEnabled": true
                  }
                ]
              }
            }
          ]
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440010",
          "email": "jack.scott@gamma.com",
          "firstName": "Jack",
          "lastName": "Scott",
          "teamId": "6ba7b815-9dad-11d1-80b4-00c04fd430c8",
          "kfPayAttributes": [
            {
              "country": "United Kingdom",
              "attributes": {
                "accessbyLevel": true,
                "accessLevel": "Non Executive",
                "referenceLevel": "Level 18",
                "businessUnits": [
                  {
                    "name": "Human Resources",
                    "accessEnabled": true
                  },
                  {
                    "name": "Benefits Administration",
                    "accessEnabled": true
                  }
                ]
              }
            },
            {
              "country": "Spain",
              "attributes": {
                "accessbyLevel": true,
                "accessLevel": "Non Executive",
                "referenceLevel": "Level 18",
                "businessUnits": [
                  {
                    "name": "Human Resources",
                    "accessEnabled": true
                  }
                ]
              }
            }
          ]
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440061",
          "email": "researcher.sophia@gamma.com",
          "firstName": "Sophia",
          "lastName": "Researcher",
          "teamId": "6ba7b814-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440062",
          "email": "scientist.alex@gamma.com",
          "firstName": "Alex",
          "lastName": "Scientist",
          "teamId": "6ba7b814-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440063",
          "email": "developer.chris@gamma.com",
          "firstName": "Chris",
          "lastName": "Developer",
          "teamId": "6ba7b814-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440064",
          "email": "analyst.megan@gamma.com",
          "firstName": "Megan",
          "lastName": "Analyst",
          "teamId": "6ba7b814-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440065",
          "email": "manager.jason@gamma.com",
          "firstName": "Jason",
          "lastName": "Manager",
          "teamId": "6ba7b815-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440066",
          "email": "specialist.kelly@gamma.com",
          "firstName": "Kelly",
          "lastName": "Specialist",
          "teamId": "6ba7b815-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440067",
          "email": "coordinator.brian@gamma.com",
          "firstName": "Brian",
          "lastName": "Coordinator",
          "teamId": "6ba7b814-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440068",
          "email": "associate.vanessa@gamma.com",
          "firstName": "Vanessa",
          "lastName": "Associate",
          "teamId": "6ba7b815-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440069",
          "email": "consultant.eric@gamma.com",
          "firstName": "Eric",
          "lastName": "Consultant",
          "teamId": "6ba7b814-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440070",
          "email": "director.jennifer@gamma.com",
          "firstName": "Jennifer",
          "lastName": "Director",
          "teamId": "6ba7b815-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440071",
          "email": "executive.marcus@gamma.com",
          "firstName": "Marcus",
          "lastName": "Executive",
          "teamId": "6ba7b814-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440072",
          "email": "lead.angela@gamma.com",
          "firstName": "Angela",
          "lastName": "Lead",
          "teamId": "6ba7b815-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440073",
          "email": "senior.daniel@gamma.com",
          "firstName": "Daniel",
          "lastName": "Senior",
          "teamId": "6ba7b814-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440074",
          "email": "principal.rebecca@gamma.com",
          "firstName": "Rebecca",
          "lastName": "Principal",
          "teamId": "6ba7b815-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440075",
          "email": "strategist.andrew@gamma.com",
          "firstName": "Andrew",
          "lastName": "Strategist",
          "teamId": "6ba7b814-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440076",
          "email": "coordinator.michelle@gamma.com",
          "firstName": "Michelle",
          "lastName": "Coordinator",
          "teamId": "6ba7b815-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440077",
          "email": "manager.justin@gamma.com",
          "firstName": "Justin",
          "lastName": "Manager",
          "teamId": "6ba7b814-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440078",
          "email": "specialist.heather@gamma.com",
          "firstName": "Heather",
          "lastName": "Specialist",
          "teamId": "6ba7b815-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440079",
          "email": "analyst.timothy@gamma.com",
          "firstName": "Timothy",
          "lastName": "Analyst",
          "teamId": "6ba7b814-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440080",
          "email": "associate.crystal@gamma.com",
          "firstName": "Crystal",
          "lastName": "Associate",
          "teamId": "6ba7b815-9dad-11d1-80b4-00c04fd430c8"
        }
      ]
    },
    {
      "id": "4d5e6f70-4567-89ab-cdef-123456789012",
      "name": "Delta Solutions",
      "subscribedProducts": ["Assess", "Pay Equity", "Profile Manager"],
      "teams": [
        {
          "teamId": "6ba7b816-9dad-11d1-80b4-00c04fd430c8",
          "name": "Consulting",
          "description": "Client advisory and strategic consulting",
          "members": ["550e8400-e29b-41d4-a716-446655440011", "550e8400-e29b-41d4-a716-446655440012", "550e8400-e29b-41d4-a716-446655440081", "550e8400-e29b-41d4-a716-446655440082", "550e8400-e29b-41d4-a716-446655440084", "550e8400-e29b-41d4-a716-446655440086", "550e8400-e29b-41d4-a716-446655440088", "550e8400-e29b-41d4-a716-446655440090", "550e8400-e29b-41d4-a716-446655440092", "550e8400-e29b-41d4-a716-446655440094", "550e8400-e29b-41d4-a716-446655440096", "550e8400-e29b-41d4-a716-446655440098", "550e8400-e29b-41d4-a716-446655440099", "550e8400-e29b-41d4-a716-446655440100"]
        },
        {
          "teamId": "6ba7b817-9dad-11d1-80b4-00c04fd430c8",
          "name": "Operations",
          "description": "Business operations and process management",
          "members": ["550e8400-e29b-41d4-a716-446655440013", "550e8400-e29b-41d4-a716-446655440083", "550e8400-e29b-41d4-a716-446655440085", "550e8400-e29b-41d4-a716-446655440087", "550e8400-e29b-41d4-a716-446655440089", "550e8400-e29b-41d4-a716-446655440091", "550e8400-e29b-41d4-a716-446655440093", "550e8400-e29b-41d4-a716-446655440095", "550e8400-e29b-41d4-a716-446655440097"]
        }
      ],
      "users": [
        {
          "userId": "550e8400-e29b-41d4-a716-446655440011",
          "email": "kate.evans@delta.com",
          "firstName": "Kate",
          "lastName": "Evans",
          "teamId": "6ba7b816-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440012",
          "email": "liam.moore@delta.com",
          "firstName": "Liam",
          "lastName": "Moore",
          "teamId": "6ba7b816-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440013",
          "email": "mia.clark@delta.com",
          "firstName": "Mia",
          "lastName": "Clark",
          "teamId": "6ba7b817-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440081",
          "email": "consultant.rachel@delta.com",
          "firstName": "Rachel",
          "lastName": "Consultant",
          "teamId": "6ba7b816-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440082",
          "email": "advisor.kevin@delta.com",
          "firstName": "Kevin",
          "lastName": "Advisor",
          "teamId": "6ba7b816-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440083",
          "email": "specialist.amy@delta.com",
          "firstName": "Amy",
          "lastName": "Specialist",
          "teamId": "6ba7b817-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440084",
          "email": "analyst.michael@delta.com",
          "firstName": "Michael",
          "lastName": "Analyst",
          "teamId": "6ba7b816-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440085",
          "email": "manager.jessica@delta.com",
          "firstName": "Jessica",
          "lastName": "Manager",
          "teamId": "6ba7b817-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440086",
          "email": "coordinator.thomas@delta.com",
          "firstName": "Thomas",
          "lastName": "Coordinator",
          "teamId": "6ba7b816-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440087",
          "email": "associate.laura@delta.com",
          "firstName": "Laura",
          "lastName": "Associate",
          "teamId": "6ba7b817-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440088",
          "email": "director.steven@delta.com",
          "firstName": "Steven",
          "lastName": "Director",
          "teamId": "6ba7b816-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440089",
          "email": "executive.nicole@delta.com",
          "firstName": "Nicole",
          "lastName": "Executive",
          "teamId": "6ba7b817-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440090",
          "email": "lead.ryan@delta.com",
          "firstName": "Ryan",
          "lastName": "Lead",
          "teamId": "6ba7b816-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440091",
          "email": "senior.ashley@delta.com",
          "firstName": "Ashley",
          "lastName": "Senior",
          "teamId": "6ba7b817-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440092",
          "email": "principal.brandon@delta.com",
          "firstName": "Brandon",
          "lastName": "Principal",
          "teamId": "6ba7b816-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440093",
          "email": "strategist.angela@delta.com",
          "firstName": "Angela",
          "lastName": "Strategist",
          "teamId": "6ba7b817-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440094",
          "email": "coordinator.daniel@delta.com",
          "firstName": "Daniel",
          "lastName": "Coordinator",
          "teamId": "6ba7b816-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440095",
          "email": "manager.rebecca@delta.com",
          "firstName": "Rebecca",
          "lastName": "Manager",
          "teamId": "6ba7b817-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440096",
          "email": "specialist.andrew@delta.com",
          "firstName": "Andrew",
          "lastName": "Specialist",
          "teamId": "6ba7b816-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440097",
          "email": "analyst.michelle@delta.com",
          "firstName": "Michelle",
          "lastName": "Analyst",
          "teamId": "6ba7b817-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440098",
          "email": "associate.justin@delta.com",
          "firstName": "Justin",
          "lastName": "Associate",
          "teamId": "6ba7b816-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440099",
          "email": "consultant.heather@delta.com",
          "firstName": "Heather",
          "lastName": "Consultant",
          "teamId": "6ba7b817-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440100",
          "email": "advisor.timothy@delta.com",
          "firstName": "Timothy",
          "lastName": "Advisor",
          "teamId": "6ba7b816-9dad-11d1-80b4-00c04fd430c8"
        }
      ]
    },
    {
      "id": "5e6f7081-5678-9abc-def0-234567890123",
      "name": "Epsilon Partners",
      "subscribedProducts": ["Pay & Markets", "Profile Manager"],
      "teams": [
        {
          "teamId": "6ba7b818-9dad-11d1-80b4-00c04fd430c8",
          "name": "Finance",
          "description": "Financial planning and analysis",
          "members": ["550e8400-e29b-41d4-a716-446655440014", "550e8400-e29b-41d4-a716-446655440015", "550e8400-e29b-41d4-a716-446655440101", "550e8400-e29b-41d4-a716-446655440103", "550e8400-e29b-41d4-a716-446655440105", "550e8400-e29b-41d4-a716-446655440107", "550e8400-e29b-41d4-a716-446655440109", "550e8400-e29b-41d4-a716-446655440111", "550e8400-e29b-41d4-a716-446655440113", "550e8400-e29b-41d4-a716-446655440115", "550e8400-e29b-41d4-a716-446655440117", "550e8400-e29b-41d4-a716-446655440119"]
        },
        {
          "teamId": "6ba7b819-9dad-11d1-80b4-00c04fd430c8",
          "name": "Legal",
          "description": "Legal compliance and risk management",
          "members": ["550e8400-e29b-41d4-a716-446655440016", "550e8400-e29b-41d4-a716-446655440017", "550e8400-e29b-41d4-a716-446655440102", "550e8400-e29b-41d4-a716-446655440104", "550e8400-e29b-41d4-a716-446655440106", "550e8400-e29b-41d4-a716-446655440108", "550e8400-e29b-41d4-a716-446655440110", "550e8400-e29b-41d4-a716-446655440112", "550e8400-e29b-41d4-a716-446655440114", "550e8400-e29b-41d4-a716-446655440116", "550e8400-e29b-41d4-a716-446655440118", "550e8400-e29b-41d4-a716-446655440120"]
        }
      ],
      "users": [
        {
          "userId": "550e8400-e29b-41d4-a716-446655440014",
          "email": "nathan.green@epsilon.com",
          "firstName": "Nathan",
          "lastName": "Green",
          "teamId": "6ba7b818-9dad-11d1-80b4-00c04fd430c8",
          "kfPayAttributes": [
            {
              "country": "Australia",
              "attributes": {
                "accessbyLevel": true,
                "accessLevel": "Executive",
                "referenceLevel": "Level 32",
                "businessUnits": [
                  {
                    "name": "Finance Division",
                    "accessEnabled": true
                  },
                  {
                    "name": "Treasury",
                    "accessEnabled": true
                  },
                  {
                    "name": "Financial Planning",
                    "accessEnabled": true
                  }
                ]
              }
            },
            {
              "country": "New Zealand",
              "attributes": {
                "accessbyLevel": true,
                "accessLevel": "Executive",
                "referenceLevel": "Level 32",
                "businessUnits": [
                  {
                    "name": "Finance Division",
                    "accessEnabled": true
                  }
                ]
              }
            }
          ]
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440015",
          "email": "olivia.hughes@epsilon.com",
          "firstName": "Olivia",
          "lastName": "Hughes",
          "teamId": "6ba7b818-9dad-11d1-80b4-00c04fd430c8",
          "kfPayAttributes": [
            {
              "country": "Australia",
              "attributes": {
                "accessbyLevel": true,
                "accessLevel": "Non Executive",
                "referenceLevel": "Level 18",
                "businessUnits": [
                  {
                    "name": "Finance Division",
                    "accessEnabled": true
                  },
                  {
                    "name": "Budget Planning",
                    "accessEnabled": true
                  }
                ]
              }
            },
            {
              "country": "Singapore",
              "attributes": {
                "accessbyLevel": false,
                "accessLevel": null,
                "referenceLevel": null,
                "businessUnits": null
              }
            }
          ]
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440016",
          "email": "paul.baker@epsilon.com",
          "firstName": "Paul",
          "lastName": "Baker",
          "teamId": "6ba7b819-9dad-11d1-80b4-00c04fd430c8",
          "kfPayAttributes": [
            {
              "country": "Australia",
              "attributes": {
                "accessbyLevel": true,
                "accessLevel": "Non Executive",
                "referenceLevel": "Level 28",
                "businessUnits": [
                  {
                    "name": "Legal Division",
                    "accessEnabled": true
                  },
                  {
                    "name": "Compliance",
                    "accessEnabled": true
                  },
                  {
                    "name": "Contract Management",
                    "accessEnabled": true
                  }
                ]
              }
            }
          ]
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440017",
          "email": "quinn.rivera@epsilon.com",
          "firstName": "Quinn",
          "lastName": "Rivera",
          "teamId": "6ba7b819-9dad-11d1-80b4-00c04fd430c8",
          "kfPayAttributes": [
            {
              "country": "Australia",
              "attributes": {
                "accessbyLevel": true,
                "accessLevel": "Non Executive",
                "referenceLevel": "Level 20",
                "businessUnits": [
                  {
                    "name": "Legal Division",
                    "accessEnabled": true
                  },
                  {
                    "name": "Risk Management",
                    "accessEnabled": true
                  }
                ]
              }
            },
            {
              "country": "Japan",
              "attributes": {
                "accessbyLevel": true,
                "accessLevel": "Non Executive",
                "referenceLevel": "Level 20",
                "businessUnits": [
                  {
                    "name": "Legal Division",
                    "accessEnabled": true
                  }
                ]
              }
            }
          ]
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440101",
          "email": "analyst.crystal@epsilon.com",
          "firstName": "Crystal",
          "lastName": "Analyst",
          "teamId": "6ba7b818-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440102",
          "email": "manager.eric@epsilon.com",
          "firstName": "Eric",
          "lastName": "Manager",
          "teamId": "6ba7b819-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440103",
          "email": "specialist.jennifer@epsilon.com",
          "firstName": "Jennifer",
          "lastName": "Specialist",
          "teamId": "6ba7b818-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440104",
          "email": "coordinator.marcus@epsilon.com",
          "firstName": "Marcus",
          "lastName": "Coordinator",
          "teamId": "6ba7b819-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440105",
          "email": "associate.angela@epsilon.com",
          "firstName": "Angela",
          "lastName": "Associate",
          "teamId": "6ba7b818-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440106",
          "email": "director.daniel@epsilon.com",
          "firstName": "Daniel",
          "lastName": "Director",
          "teamId": "6ba7b819-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440107",
          "email": "executive.rebecca@epsilon.com",
          "firstName": "Rebecca",
          "lastName": "Executive",
          "teamId": "6ba7b818-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440108",
          "email": "lead.andrew@epsilon.com",
          "firstName": "Andrew",
          "lastName": "Lead",
          "teamId": "6ba7b819-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440109",
          "email": "senior.michelle@epsilon.com",
          "firstName": "Michelle",
          "lastName": "Senior",
          "teamId": "6ba7b818-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440110",
          "email": "principal.justin@epsilon.com",
          "firstName": "Justin",
          "lastName": "Principal",
          "teamId": "6ba7b819-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440111",
          "email": "strategist.heather@epsilon.com",
          "firstName": "Heather",
          "lastName": "Strategist",
          "teamId": "6ba7b818-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440112",
          "email": "coordinator.timothy@epsilon.com",
          "firstName": "Timothy",
          "lastName": "Coordinator",
          "teamId": "6ba7b819-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440113",
          "email": "manager.sarah@epsilon.com",
          "firstName": "Sarah",
          "lastName": "Manager",
          "teamId": "6ba7b818-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440114",
          "email": "specialist.mike@epsilon.com",
          "firstName": "Mike",
          "lastName": "Specialist",
          "teamId": "6ba7b819-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440115",
          "email": "analyst.anna@epsilon.com",
          "firstName": "Anna",
          "lastName": "Analyst",
          "teamId": "6ba7b818-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440116",
          "email": "associate.david@epsilon.com",
          "firstName": "David",
          "lastName": "Associate",
          "teamId": "6ba7b819-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440117",
          "email": "consultant.emma@epsilon.com",
          "firstName": "Emma",
          "lastName": "Consultant",
          "teamId": "6ba7b818-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440118",
          "email": "advisor.james@epsilon.com",
          "firstName": "James",
          "lastName": "Advisor",
          "teamId": "6ba7b819-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440119",
          "email": "director.maria@epsilon.com",
          "firstName": "Maria",
          "lastName": "Director",
          "teamId": "6ba7b818-9dad-11d1-80b4-00c04fd430c8"
        },
        {
          "userId": "550e8400-e29b-41d4-a716-446655440120",
          "email": "executive.carlos@epsilon.com",
          "firstName": "Carlos",
          "lastName": "Executive",
          "teamId": "6ba7b819-9dad-11d1-80b4-00c04fd430c8"
        }
      ]
    },
    {
      "id": "2b3c4d5e-2345-6789-bcde-f12345678901",
      "name": "TechStart Inc",
      "subscribedProducts": ["Assess", "KF Assess", "Profile Manager"],
      "teams": [
        {
          "teamId": "7cb8c921-0ebe-12e2-91c5-11d15fe541d9",
          "name": "HR Team",
          "description": "Human Resources team with access to assessment tools",
          "members": ["660f9511-f3ac-52e5-b827-557766551001", "660f9511-f3ac-52e5-b827-557766551002"]
        },
        {
          "teamId": "7cb8c922-0ebe-12e2-91c5-11d15fe541d9",
          "name": "Engineering Team",
          "description": "Software engineering team with profile management access",
          "members": ["660f9511-f3ac-52e5-b827-557766551003", "660f9511-f3ac-52e5-b827-557766551004"]
        }
      ],
      "users": [
        {
          "userId": "660f9511-f3ac-52e5-b827-557766551001",
          "email": "hr.director@techstart.com",
          "firstName": "Jennifer",
          "lastName": "Rodriguez",
          "teamId": "7cb8c921-0ebe-12e2-91c5-11d15fe541d9"
        },
        {
          "userId": "660f9511-f3ac-52e5-b827-557766551002",
          "email": "hr.manager@techstart.com",
          "firstName": "Michael",
          "lastName": "Chen",
          "teamId": "7cb8c921-0ebe-12e2-91c5-11d15fe541d9"
        },
        {
          "userId": "660f9511-f3ac-52e5-b827-557766551003",
          "email": "lead.developer@techstart.com",
          "firstName": "Alex",
          "lastName": "Thompson",
          "teamId": "7cb8c922-0ebe-12e2-91c5-11d15fe541d9"
        },
        {
          "userId": "660f9511-f3ac-52e5-b827-557766551004",
          "email": "senior.dev@techstart.com",
          "firstName": "Priya",
          "lastName": "Patel",
          "teamId": "7cb8c922-0ebe-12e2-91c5-11d15fe541d9"
        }
      ]
    },
    {
      "id": "3c4d5e6f-3456-7890-cdef-23456789012",
      "name": "Global Finance Corp",
      "subscribedProducts": ["Pay & Markets", "KF Pay", "Tableau"],
      "teams": [
        {
          "teamId": "8dc9da32-1fcf-23f3-a2d6-22e26ff652ea",
          "name": "Compensation Team",
          "description": "Compensation and benefits management team",
          "members": ["771g0622-g4bd-63f6-c938-668877662001", "771g0622-g4bd-63f6-c938-668877662002"]
        },
        {
          "teamId": "8dc9da33-1fcf-23f3-a2d6-22e26ff652ea",
          "name": "Analytics Team",
          "description": "Data analytics and reporting team",
          "members": ["771g0622-g4bd-63f6-c938-668877662003", "771g0622-g4bd-63f6-c938-668877662004"]
        }
      ],
      "users": [
        {
          "userId": "771g0622-g4bd-63f6-c938-668877662001",
          "email": "comp.director@globalfinance.com",
          "firstName": "Robert",
          "lastName": "Wilson",
          "teamId": "8dc9da32-1fcf-23f3-a2d6-22e26ff652ea",
          "kfPayAttributes": [
            {
              "country": "United States",
              "attributes": {
                "marketInsights": "Access",
                "rewardHealthcheck": "Access by Level",
                "rewardBenchmarking": "Access by Level",
                "compensationBenefitsReport": "Access",
                "genderAnalysis": true,
                "accessByLevel": "Access All Levels",
                "kfPayReferenceLevel": "Level 40 (15000 - 18000)",
                "otherReports": "Access",
                "accessbyLevel": true,
                "accessLevel": "Executive",
                "referenceLevel": "Level 25",
                "businessUnits": [
                  {
                    "name": "Investment Banking",
                    "accessEnabled": true
                  },
                  {
                    "name": "Asset Management",
                    "accessEnabled": true
                  }
                ]
              }
            }
          ]
        },
        {
          "userId": "771g0622-g4bd-63f6-c938-668877662002",
          "email": "comp.analyst@globalfinance.com",
          "firstName": "Lisa",
          "lastName": "Garcia",
          "teamId": "8dc9da32-1fcf-23f3-a2d6-22e26ff652ea"
        },
        {
          "userId": "771g0622-g4bd-63f6-c938-668877662003",
          "email": "data.scientist@globalfinance.com",
          "firstName": "David",
          "lastName": "Kim",
          "teamId": "8dc9da33-1fcf-23f3-a2d6-22e26ff652ea"
        },
        {
          "userId": "771g0622-g4bd-63f6-c938-668877662004",
          "email": "analytics.lead@globalfinance.com",
          "firstName": "Sarah",
          "lastName": "Johnson",
          "teamId": "8dc9da33-1fcf-23f3-a2d6-22e26ff652ea"
        }
      ]
    },
    {
      "id": "4d5e6f7g-4567-8901-def0-34567890123",
      "name": "Healthcare Solutions Ltd",
      "subscribedProducts": ["Assess", "Listen", "Profile Manager"],
      "teams": [
        {
          "teamId": "9ed0eb43-2gdg-34g4-b3e7-33f37gg763fb",
          "name": "Clinical Team",
          "description": "Clinical staff with assessment and listening tools",
          "members": ["882h1733-h5ce-74g7-d049-779988773001", "882h1733-h5ce-74g7-d049-779988773002"]
        },
        {
          "teamId": "9ed0eb44-2gdg-34g4-b3e7-33f37gg763fb",
          "name": "Admin Team",
          "description": "Administrative staff with profile management access",
          "members": ["882h1733-h5ce-74g7-d049-779988773003", "882h1733-h5ce-74g7-d049-779988773004"]
        }
      ],
      "users": [
        {
          "userId": "882h1733-h5ce-74g7-d049-779988773001",
          "email": "chief.medical@healthcare.com",
          "firstName": "Dr. Emily",
          "lastName": "Brown",
          "teamId": "9ed0eb43-2gdg-34g4-b3e7-33f37gg763fb"
        },
        {
          "userId": "882h1733-h5ce-74g7-d049-779988773002",
          "email": "nurse.manager@healthcare.com",
          "firstName": "Nurse",
          "lastName": "Williams",
          "teamId": "9ed0eb43-2gdg-34g4-b3e7-33f37gg763fb"
        },
        {
          "userId": "882h1733-h5ce-74g7-d049-779988773003",
          "email": "admin.director@healthcare.com",
          "firstName": "Thomas",
          "lastName": "Davis",
          "teamId": "9ed0eb44-2gdg-34g4-b3e7-33f37gg763fb"
        },
        {
          "userId": "882h1733-h5ce-74g7-d049-779988773004",
          "email": "hr.coordinator@healthcare.com",
          "firstName": "Amanda",
          "lastName": "Taylor",
          "teamId": "9ed0eb44-2gdg-34g4-b3e7-33f37gg763fb"
        }
      ]
    },
    {
      "id": "5e6f7g8h-5678-9012-ef01-45678901234",
      "name": "Retail Innovations",
      "subscribedProducts": ["KF Architect", "Tableau", "Listen"],
      "teams": [
        {
          "teamId": "0fe1fc54-3heh-45h5-c4f8-44g48hh874gc",
          "name": "Store Operations",
          "description": "Store operations and management team",
          "members": ["993i2844-i6df-85h8-e15a-88aa998884001", "993i2844-i6df-85h8-e15a-88aa998884002"]
        },
        {
          "teamId": "0fe1fc55-3heh-45h5-c4f8-44g48hh874gc",
          "name": "Customer Experience",
          "description": "Customer experience and feedback team",
          "members": ["993i2844-i6df-85h8-e15a-88aa998884003", "993i2844-i6df-85h8-e15a-88aa998884004"]
        }
      ],
      "users": [
        {
          "userId": "993i2844-i6df-85h8-e15a-88aa998884001",
          "email": "ops.director@retailinnovations.com",
          "firstName": "Kevin",
          "lastName": "Martinez",
          "teamId": "0fe1fc54-3heh-45h5-c4f8-44g48hh874gc"
        },
        {
          "userId": "993i2844-i6df-85h8-e15a-88aa998884002",
          "email": "store.manager@retailinnovations.com",
          "firstName": "Rachel",
          "lastName": "Anderson",
          "teamId": "0fe1fc54-3heh-45h5-c4f8-44g48hh874gc"
        },
        {
          "userId": "993i2844-i6df-85h8-e15a-88aa998884003",
          "email": "cx.lead@retailinnovations.com",
          "firstName": "Jordan",
          "lastName": "Lee",
          "teamId": "0fe1fc55-3heh-45h5-c4f8-44g48hh874gc"
        },
        {
          "userId": "993i2844-i6df-85h8-e15a-88aa998884004",
          "email": "feedback.analyst@retailinnovations.com",
          "firstName": "Sophie",
          "lastName": "Clark",
          "teamId": "0fe1fc55-3heh-45h5-c4f8-44g48hh874gc"
        }
      ]
    }
  ]
};

export const getClients = (): Client[] => {
  // Returns the static list of clients from clientData
  return clientData.clients;
};

export const getClientById = (id: string): Client | undefined => {
  return clientData.clients.find(client => client.id === id);
};

export const getUsersByClientId = (clientId: string): User[] => {
  const client = getClientById(clientId);
  return client ? client.users : [];
};

export const getTeamsByClientId = (clientId: string): Team[] => {
  const client = getClientById(clientId);
  return client ? client.teams : [];
};

export const getTeamById = (clientId: string, teamId: string): Team | undefined => {
  const client = getClientById(clientId);
  return client ? client.teams.find(team => team.teamId === teamId) : undefined;
};

export const getUserTeam = (clientId: string, userId: string): Team | undefined => {
  const user = getUsersByClientId(clientId).find(u => u.userId === userId);
  if (!user || !user.teamId) return undefined;
  return getTeamById(clientId, user.teamId);
};
