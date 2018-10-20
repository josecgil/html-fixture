import HtmlFixture from "../lib/html-fixture";

test("should create a new instance on lib package", () => {
    const newFixtureInstance=new HtmlFixture();
    const root=newFixtureInstance.rootElement();
    expect(root).toBe(null);
});
