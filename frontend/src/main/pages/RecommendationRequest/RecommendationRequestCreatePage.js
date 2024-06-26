import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import RecommendationRequestForm from "main/components/RecommendationRequest/RecommendationRequestForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function RecommendationRequestCreatePage({storybook=false}) {
    const objectToAxiosParams = (request) => ({
        url: "/api/recommendationrequest/post",
        method: "POST",
        params: {
            requesterEmail: request.requesterEmail,
            professorEmail: request.professorEmail,
            explanation: request.explanation,
            dateRequested: request.dateRequested,
            dateNeeded: request.dateNeeded,
            done: request.done
        }
    });

    const onSuccess = (request) => {
        toast(`New recommendation request Created - id: ${request.id} requester email: ${request.requesterEmail} professor email: ${request.professorEmail} explanation: ${request.explanation} date requested: ${request.dateRequested} date needed: ${request.dateNeeded} done: ${request.done}`);
    }

    const mutation = useBackendMutation(
        objectToAxiosParams,
        { onSuccess },
        // Stryker disable next-line all : hard to set up test for caching
        ["/api/recommendationrequest/all"] // mutation makes this key stale so that pages relying on it reload
    );

    const { isSuccess } = mutation

    const onSubmit = async (data) => {
        mutation.mutate(data);
    }

    if (isSuccess && !storybook) {
        return <Navigate to="/recommendationrequest" />
    }

    return (
        <BasicLayout>
            <div className="pt-2">
                <h1>Create New Recommendation Request</h1>
                <RecommendationRequestForm submitAction={onSubmit} />
            </div>
        </BasicLayout>
    )
}
