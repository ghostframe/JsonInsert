var CollectionNormalizer = require("../src/CollectionNormalizer.js");
var expect = require("chai").expect;

describe("CollectionNormalizer", function () {
    describe("getNormalizedCollections(collection)", function () {
        it("links out embedded collection through document id", function () {
            var collection =
                    {
                        name: "people",
                        documents: [
                            {
                                id: 1,
                                name: "George",
                                height: 2.49,
                                cars: [
                                    {
                                        model: "Mazda"
                                    },
                                    {
                                        model: "Porsche",
                                        year: 2000
                                    }
                                ]
                            }
                        ]
                    };

            var normalizedCollection = CollectionNormalizer.getNormalizedCollections(collection);

            expect(normalizedCollection).to.deep.equal(
                    [
                        {
                            name: "people",
                            documents: [
                                {
                                    id: 1,
                                    name: "George",
                                    height: 2.49
                                }
                            ]
                        },
                        {
                            name: "cars",
                            documents: [
                                {
                                    model: "Mazda",
                                    person_id: 1
                                },
                                {
                                    model: "Porsche",
                                    year: 2000,
                                    person_id: 1
                                }
                            ]
                        }
                    ]
                    );
        });
        it("links out embedded collection, generating id when it's missing", function () {
            var collection =
                    {
                        name: "people",
                        documents: [
                            {
                                name: "George",
                                height: 2.49,
                                cars: [
                                    {
                                        model: "Mazda"
                                    },
                                    {
                                        model: "Porsche",
                                        year: 2000
                                    }
                                ]
                            }
                        ]
                    };

            var normalizedCollections = CollectionNormalizer.getNormalizedCollections(collection);
            expect(normalizedCollections).to.deep.equal(
                    [
                        {
                            name: "people",
                            documents: [
                                {
                                    id: 1,
                                    name: "George",
                                    height: 2.49
                                }
                            ]
                        },
                        {
                            name: "cars",
                            documents: [
                                {
                                    model: "Mazda",
                                    person_id: 1
                                },
                                {
                                    model: "Porsche",
                                    year: 2000,
                                    person_id: 1
                                }
                            ]
                        }
                    ]
                    );
        });
        it("links out embedded collections through document id's", function () {
            var collection =
                    {
                        name: "people",
                        documents: [
                            {
                                id: 1,
                                name: "George",
                                height: 2.49,
                                cars: [
                                    {
                                        model: "Mazda"
                                    },
                                    {
                                        model: "Porsche",
                                        year: 2000
                                    }
                                ]
                            },
                            {
                                id: 2,
                                name: "John",
                                height: 1.49,
                                cars: [
                                    {
                                        model: "Fiat",
                                        year: 2004
                                    },
                                    {
                                        model: "Volskwagen",
                                        year: 2001
                                    }
                                ]
                            }
                        ]
                    };

            var normalizedCollections = CollectionNormalizer.getNormalizedCollections(collection);
            var peopleCollection = normalizedCollections.find(
                    normalizedCollection => normalizedCollection.name === "people");
            var idOfGeorge = peopleCollection.documents[0].id;
            expect(idOfGeorge).to.not.be.an('undefined');
            expect(normalizedCollections).to.deep.equal(
                    [
                        {
                            name: "people",
                            documents: [
                                {
                                    id: 1,
                                    name: "George",
                                    height: 2.49
                                },
                                {
                                    id: 2,
                                    name: "John",
                                    height: 1.49
                                }
                            ]
                        },
                        {
                            name: "cars",
                            documents: [
                                {
                                    model: "Mazda",
                                    person_id: 1
                                },
                                {
                                    model: "Porsche",
                                    year: 2000,
                                    person_id: 1
                                },
                                {
                                    model: "Fiat",
                                    year: 2004,
                                    person_id: 2
                                },
                                {
                                    model: "Volskwagen",
                                    year: 2001,
                                    person_id: 2
                                }
                            ]
                        }
                    ]
                    );
        });
        it("links out embedded collections, generating unique id's when all are missing", function () {
            var collection =
                    {
                        name: "people",
                        documents: [
                            {
                                name: "George",
                                height: 2.49,
                                cars: [
                                    {
                                        model: "Mazda"
                                    },
                                    {
                                        model: "Porsche",
                                        year: 2000
                                    }
                                ]
                            },
                            {
                                name: "John",
                                height: 1.49,
                                cars: [
                                    {
                                        model: "Fiat",
                                        year: 2004
                                    },
                                    {
                                        model: "Volskwagen",
                                        year: 2001
                                    }
                                ]
                            }
                        ]
                    };

            var normalizedCollections = CollectionNormalizer.getNormalizedCollections(collection);
            var peopleCollection = normalizedCollections.find(
                    normalizedCollection => normalizedCollection.name === "people");
            var idOfGeorge = peopleCollection.documents[0].id;
            expect(idOfGeorge).to.not.be.an('undefined');
            expect(normalizedCollections).to.deep.equal(
                    [
                        {
                            name: "people",
                            documents: [
                                {
                                    id: 1,
                                    name: "George",
                                    height: 2.49
                                },
                                {
                                    id: 2,
                                    name: "John",
                                    height: 1.49
                                }
                            ]
                        },
                        {
                            name: "cars",
                            documents: [
                                {
                                    model: "Mazda",
                                    person_id: 1
                                },
                                {
                                    model: "Porsche",
                                    year: 2000,
                                    person_id: 1
                                },
                                {
                                    model: "Fiat",
                                    year: 2004,
                                    person_id: 2
                                },
                                {
                                    model: "Volskwagen",
                                    year: 2001,
                                    person_id: 2
                                }
                            ]
                        }
                    ]
                    );
        });
        it("links out embedded collections, generating unique id's when last ones are missing", function () {
            var collection =
                    {
                        name: "people",
                        documents: [
                            {
                                id: 1,
                                name: "George",
                                height: 2.49,
                                cars: [
                                    {
                                        model: "Mazda"
                                    },
                                    {
                                        model: "Porsche",
                                        year: 2000
                                    }
                                ]
                            },
                            {
                                id: 2,
                                name: "John",
                                height: 1.49,
                                cars: [
                                    {
                                        model: "Fiat",
                                        year: 2004
                                    },
                                    {
                                        model: "Volskwagen",
                                        year: 2001
                                    }
                                ]
                            },
                            {
                                name: "James",
                                height: 1.49,
                                cars: [
                                    {
                                        model: "BMW",
                                        year: 2007
                                    }
                                ]
                            }
                        ]
                    };

            var normalizedCollections = CollectionNormalizer.getNormalizedCollections(collection);
            var peopleCollection = normalizedCollections.find(
                    normalizedCollection => normalizedCollection.name === "people");
            var idOfGeorge = peopleCollection.documents[0].id;
            expect(idOfGeorge).to.not.be.an('undefined');
            expect(normalizedCollections).to.deep.equal(
                    [
                        {
                            name: "people",
                            documents: [
                                {
                                    id: 1,
                                    name: "George",
                                    height: 2.49
                                },
                                {
                                    id: 2,
                                    name: "John",
                                    height: 1.49
                                },
                                {
                                    id: 3,
                                    name: "James",
                                    height: 1.49
                                }
                            ]
                        },
                        {
                            name: "cars",
                            documents: [
                                {
                                    model: "Mazda",
                                    person_id: 1
                                },
                                {
                                    model: "Porsche",
                                    year: 2000,
                                    person_id: 1
                                },
                                {
                                    model: "Fiat",
                                    year: 2004,
                                    person_id: 2
                                },
                                {
                                    model: "Volskwagen",
                                    year: 2001,
                                    person_id: 2
                                },
                                {
                                    model: "BMW",
                                    year: 2007,
                                    person_id: 3
                                }
                            ]
                        }
                    ]
                    );
        });
        it("links out embedded embedded collections", function () {
            var collection =
                    {
                        name: "people",
                        documents: [
                            {
                                id: 1,
                                name: "George",
                                height: 2.49,
                                cars: [
                                    {
                                        id: 1,
                                        model: "Mazda",
                                        sponsors: [
                                            {brand: "MOMO"},
                                            {brand: "Yokohama"}
                                        ]
                                    },
                                    {
                                        model: "Porsche",
                                        year: 2000,
                                        sponsors: [
                                            {brand: "Toyo"}
                                        ]
                                    }
                                ]
                            },
                            {
                                id: 2,
                                name: "John",
                                height: 1.49,
                                cars: [
                                    {
                                        model: "Fiat",
                                        year: 2004
                                    },
                                    {
                                        model: "Volskwagen",
                                        year: 2001,
                                        sponsors: [
                                            {brand: "HHCL"}
                                        ]
                                    }
                                ]
                            },
                            {
                                id: 3,
                                name: "James",
                                height: 1.49,
                                cars: [
                                    {
                                        model: "BMW",
                                        year: 2007
                                    }
                                ]
                            }
                        ]
                    };

            var normalizedCollections = CollectionNormalizer.getNormalizedCollections(collection);
            var peopleCollection = normalizedCollections.find(
                    normalizedCollection => normalizedCollection.name === "people");
            var idOfGeorge = peopleCollection.documents[0].id;
            expect(idOfGeorge).to.not.be.an('undefined');
            expect(normalizedCollections).to.deep.equal(
                    [
                        {
                            name: "people",
                            documents: [
                                {
                                    id: 1,
                                    name: "George",
                                    height: 2.49
                                },
                                {
                                    id: 2,
                                    name: "John",
                                    height: 1.49
                                },
                                {
                                    id: 3,
                                    name: "James",
                                    height: 1.49
                                }
                            ]
                        },
                        {
                            name: "cars",
                            documents: [
                                {
                                    id: 1,
                                    model: "Mazda",
                                    person_id: 1
                                },
                                {
                                    id: 2,
                                    model: "Porsche",
                                    year: 2000,
                                    person_id: 1
                                },
                                {
                                    model: "Fiat",
                                    year: 2004,
                                    person_id: 2
                                },
                                {
                                    id: 3,
                                    model: "Volskwagen",
                                    year: 2001,
                                    person_id: 2
                                },
                                {
                                    model: "BMW",
                                    year: 2007,
                                    person_id: 3
                                }
                            ]
                        },
                        {
                            name: "sponsors",
                            documents: [
                                {
                                    brand: "MOMO",
                                    car_id: 1
                                },
                                {
                                    brand: "Yokohama",
                                    car_id: 1
                                },
                                {
                                    brand: "Toyo",
                                    car_id: 2
                                },
                                {
                                    brand: "HHCL",
                                    car_id: 3
                                }
                            ]
                        }
                    ]
                    );
        });
    });
});