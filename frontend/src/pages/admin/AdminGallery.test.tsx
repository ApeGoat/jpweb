import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import AdminGallery from "./AdminGallery";
import { api, GalleryItem } from "../../api/client";

jest.mock("../../api/client", () => ({ api: { adminGetGallery: jest.fn(), adminReorderGallery: jest.fn(), adminUploadGalleryImage: jest.fn() } }));
jest.mock("./AdminLayout", () => ({ __esModule: true, default: ({ children }: any) => <main>{children}</main>, AdminMessage: ({ children, error }: any) => <p role={error ? "alert" : "status"}>{children}</p> }));
let mockDrop: (event: any) => void;
jest.mock("@dnd-kit/core", () => ({
    ...jest.requireActual("@dnd-kit/core"),
    DndContext: ({ children, onDragEnd }: any) => { mockDrop = onDragEnd; return <div>{children}</div>; },
}));
const first: GalleryItem = { id: 5, imageUrl: "https://example.com/original-five.jpg", caption: "First", altText: "First alt", displayOrder: 0, visible: true };
const second: GalleryItem = { ...first, id: 2, imageUrl: "https://example.com/original-two.jpg", caption: "Second", altText: "Second alt", displayOrder: 1 };
const order = () => screen.getAllByRole("img").map(image => image.getAttribute("src"));
beforeEach(() => { jest.clearAllMocks(); (api.adminGetGallery as jest.Mock).mockResolvedValue([first, second]); });

test("renders backend order, saves the complete dropped order optimistically and restores it on reload", async () => {
    let resolve!: (items: GalleryItem[]) => void;
    (api.adminReorderGallery as jest.Mock).mockReturnValue(new Promise(done => { resolve = done; }));
    const view = render(<AdminGallery />);
    await screen.findByAltText("First alt");
    expect(order()).toEqual([first.imageUrl, second.imageUrl]);
    act(() => mockDrop({ active: { id: 5 }, over: { id: 2 } }));
    expect(order()).toEqual([second.imageUrl, first.imageUrl]);
    expect(api.adminReorderGallery).toHaveBeenCalledWith([2, 5]);
    expect(screen.getAllByText("Supprimer")[0]).toBeDisabled();
    await act(async () => resolve([second, first]));
    view.unmount();
    (api.adminGetGallery as jest.Mock).mockResolvedValue([second, first]);
    render(<AdminGallery />);
    await screen.findByAltText("First alt");
    expect(order()).toEqual([second.imageUrl, first.imageUrl]);
});

test("failed save restores previous order and reports the error", async () => {
    (api.adminReorderGallery as jest.Mock).mockRejectedValue(new Error("offline"));
    render(<AdminGallery />); await screen.findByAltText("First alt");
    await act(async () => mockDrop({ active: { id: 5 }, over: { id: 2 } }));
    expect(await screen.findByRole("alert")).toHaveTextContent("rétabli");
    expect(order()).toEqual([first.imageUrl, second.imageUrl]);
});

test("cancelled or unchanged drop does not save, editing has no order input", async () => {
    render(<AdminGallery />); await screen.findByAltText("First alt");
    act(() => mockDrop({ active: { id: 5 }, over: null }));
    act(() => mockDrop({ active: { id: 5 }, over: { id: 5 } }));
    expect(api.adminReorderGallery).not.toHaveBeenCalled();
    fireEvent.click(screen.getAllByText("Modifier")[0]);
    expect(screen.queryByRole("spinbutton")).not.toBeInTheDocument();
});

test("upload sends no order number and displays the new last item returned by the backend", async () => {
    const last = { ...first, id: 9, altText: "New alt", imageUrl: "https://example.com/new.jpg" };
    (api.adminUploadGalleryImage as jest.Mock).mockResolvedValue(last);
    render(<AdminGallery />); await screen.findByAltText("First alt");
    (api.adminGetGallery as jest.Mock).mockResolvedValue([first, second, last]);
    fireEvent.change(screen.getByLabelText("Image"), { target: { files: [new File(["image"], "new.png", { type: "image/png" })] } });
    fireEvent.click(screen.getByRole("button", { name: "Téléverser l’image" }));
    await waitFor(() => expect(api.adminUploadGalleryImage).toHaveBeenCalled());
    expect((api.adminUploadGalleryImage as jest.Mock).mock.calls[0][0].has("displayOrder")).toBe(false);
    await screen.findByAltText("New alt");
    expect(order()).toEqual([first.imageUrl, second.imageUrl, last.imageUrl]);
});
