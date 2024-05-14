import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import ArticlesCreatePage from "main/pages/Articles/ArticlesCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

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
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("ArticlesCreatePage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
        jest.clearAllMocks();
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <articlesCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("on submit, makes request to backend, and redirects to /articles", async () => {

        const queryClient = new QueryClient();
        const articles = {
            id: 3,
            title: "Okay", 
            url: ".com",
            explanation: "Sandwiches and Salads",
            dateAdded:  "2022-02-02T00:00",
            email: "@l",

        };
        axiosMock.onPost("/api/articles/post").reply(202, articles);
        
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <articlesCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        )
        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual({
            name: "South Coast Deli",
            description: "Sandwiches and Salads"
        });

        // assert - check that the toast was called with the expected message
        expect(mockToast).toBeCalledWith("New articles Created - id: 3 name: South Coast Deli");
        expect(mockNavigate).toBeCalledWith({ "to": "/articles" });

    });
});


