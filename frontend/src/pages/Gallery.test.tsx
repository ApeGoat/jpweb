import { render, screen } from "@testing-library/react";
import Gallery from "./Gallery";
import { api } from "../api/client";
let mockPath = "/gallerie";
jest.mock("react-router-dom", () => ({ useLocation: () => ({ pathname: mockPath }) }), { virtual: true });
jest.mock("../api/client", () => ({ api: { getGallery: jest.fn() } }));
test.each(["/gallerie", "/en/gallery"])("%s preserves the backend image order and URLs", async path => {
    mockPath = path;
    (api.getGallery as jest.Mock).mockResolvedValue([
        { id: 2, imageUrl: "https://example.com/two", altText: "Second", caption: "Second" },
        { id: 5, imageUrl: "https://example.com/five", altText: "First", caption: "First" },
    ]);
    render(<Gallery />);
    await screen.findByAltText("Second");
    expect(screen.getAllByRole("img").map(image => image.getAttribute("src")))
        .toEqual(["https://example.com/two", "https://example.com/five"]);
});
