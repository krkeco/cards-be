
const filterByTerm = require("./filterByTerm");

describe("Filter function", () => {
  // test stuff
    const input = [
      { id: 1, url: "https://www.url1.dev" },
      { id: 2, url: "https://www.url2.dev" },
      { id: 3, url: "https://www.link3.dev" }
    ];
    
    test("it should filter by a search term (link)", () => {
    // actual test

    const output = [{ id: 3, url: "https://www.link3.dev" }];
		expect(filterByTerm(input, "link")).toEqual(output);
		expect(filterByTerm(input, "LINK")).toEqual(output);
		// expect(filterByTerm(input, "uRi")).toEqual(output);
		// expect(filterByTerm(input, "")).toEqual(output);
  });
    test("it should not allow empty", () => {
    const output = "searchTerm cannot be empty";
   	expect(()=>{filterByTerm(input, "")}).toThrow("searchTerm cannot be empty");
  });
 test("it should return empty when no results", () => {
   	expect(filterByTerm(input, "uRi")).toEqual([]);
  });
});