import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import ArticlesEditPage from "main/pages/Articles/ArticlesEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        useParams: () => ({
            id: 17
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("ArticlesEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/articles", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <ArticlesEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit Articles");
            expect(screen.queryByTestId("ArticleForm-url")).not.toBeInTheDocument();
            restoreConsole();
        });
    });

    describe("tests where backend is working normally", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/articles", { params: { id: 17 } }).reply(200, {
                "id": 17,
                "title": "Jump man can't jump",
                "explanation": "Drake fails to make a basketball dunk",
                "dateAdded" : "2022-07-04T12:00:00",
                "url" : "https://drakenews.com/",
                "email" : "drakenews@gmail.com",
            });
            axiosMock.onPut('/api/articles').reply(200, {
                "id": 17,
                "title": "banana",
                "explanation": "b",
                "dateAdded" : "2022-07-05T12:00:00",
                "url" : "a",
                "email" : "c",
            });
        });

        const queryClient = new QueryClient();

        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <ArticlesEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("ArticlesForm-id");

            const id = screen.getByTestId("ArticlesForm-id")
            expect(id).toHaveValue("17")
            const title = screen.getByTestId("ArticlesForm-title")
            expect(title).toHaveValue("Jump man can't jump")
            const dateAdded = screen.getByTestId("ArticlesForm-dateAdded")
            expect(dateAdded).toHaveValue("2022-07-04T12:00")
            const email = screen.getByTestId("ArticlesForm-email")
            expect(email).toHaveValue("drakenews@gmail.com")
            const url =  screen.getByTestId("ArticlesForm-url")
            expect(url).toHaveValue("https://drakenews.com/")
            const explanation = screen.getByTestId("ArticlesForm-explanation")
            expect(explanation).toHaveValue("Drake fails to make a basketball dunk")
            const submit = screen.getByTestId("ArticlesForm-submit")

            fireEvent.change(title, { target: { value: 'banana' } });
            fireEvent.change(dateAdded, { target: { value: '2022-07-05T12:00:00' } });
            fireEvent.change(email, { target: { value: 'c' } });
            fireEvent.change(url, { target: { value: 'a' } });
            fireEvent.change(explanation, { target: { value: 'b' } });
            fireEvent.click(submit);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("Articlearticles Updated - id: 17 title: banana");

            expect(mockNavigate).toBeCalledWith({ "to": "/articles" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                "title": "banana",
                "dateAdded" : "2022-07-05T12:00",
                "url" : "a",
                "explanation": "b",
                "email" : "c",
            })); // posted object


        });

    });
});
