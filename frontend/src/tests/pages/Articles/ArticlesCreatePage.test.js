
import { render, waitFor, fireEvent, screen } from "@testing-library/react";

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

    const axiosMock =new AxiosMockAdapter(axios);

    beforeEach(() => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);

    });



    test("renders without crashing", () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ArticlesCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });
    
    test("on submit, makes request to backend, and redirects to /articles", async () => {
        

        
        const queryClient = new QueryClient();
        const articles = {
            id: 3,
            title: "nah",
            explanation: "Bad bad bad",
            email: "123milkz@gmail.com",
            url: "123milkz.com",
            dateAdded: "2010-06-15T00:00"

        };

        axiosMock.onPost('/api/articles/post').reply(202, articles);
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ArticlesCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        await waitFor(() => {
            expect(screen.getByLabelText("Title")).toBeInTheDocument();
        });
        
        const titleInput = screen.getByLabelText("Title");
        expect(titleInput).toBeInTheDocument();
        const explanationinput = screen.getByLabelText("Explanation");
        expect(explanationinput).toBeInTheDocument();

        const urlInput = screen.getByLabelText("Url")
        expect(urlInput).toBeInTheDocument();

        const emailInput = screen.getByLabelText("Email");
        expect(emailInput).toBeInTheDocument();

        const date = screen.getByLabelText("Date(iso format)")
        expect(date).toBeInTheDocument();


        fireEvent.change(titleInput, { target: { value: 'nah' } })
        fireEvent.change(explanationinput, { target: { value: 'Bad bad bad' } })
        fireEvent.change(emailInput, {target: {value: '123milkz@gmail.com'}})
        fireEvent.change(urlInput, {target: {value: '123milkz.com'}})
        fireEvent.change(date, {target: {value: "2010-06-15T00:00"}})
        
        const createButton = screen.getByText("Create");
        expect(createButton).toBeInTheDocument();
        fireEvent.click(createButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));
        expect(axiosMock.history.post[0].params).toEqual({
            title: "nah",
            explanation: "Bad bad bad",
            email: "123milkz@gmail.com",
            url: "123milkz.com",
            dateAdded: "2010-06-15T00:00"
        });

        expect(mockToast).toBeCalledWith("New Article Created - id: 3 title: nah");
        expect(mockNavigate).toBeCalledWith({ "to": "/articles" });

    });


});


