import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import {Navigate, useParams} from "react-router-dom";
import {useBackend, useBackendMutation} from "../../utils/useBackend";
import {toast} from "react-toastify";
import RecommendationRequestForm from "../../components/RecommendationRequest/RecommendationRequestForm";

export default function RecommendationRequestEditPage({storybook=false}) {
  let { id } = useParams();
  const { data: request, _error, _status } =
       useBackend(
           // Stryker disable next-line all : don't test internal caching of React Query
           [`/api/restaurants?id=${id}`],
           {  // Stryker disable next-line all : GET is the default, so mutating this to "" doesn't introduce a bug
               method: "GET",
               url: `/api/recommendationrequest`,
               params: {
                   id
               }
           }
       );
    const objectToAxiosPutParams = (request) => ({
        url: "/api/recommendationrequest",
        method: "PUT",
        params: {
            id: request.id,
        },
        data: {
            requesterEmail: request.requesterEmail,
            professorEmail: request.professorEmail,
            explanation: request.explanation,
            dateRequested: request.dateRequested,
            dateNeeded: request.dateNeeded,
            done: request.done
        }
    });

    const onSuccess = (request) => {
        toast(`Recommendation request update - id: ${request.id} requester email: ${request.requesterEmail} professor email: ${request.professorEmail} explanation: ${request.explanation} date requested: ${request.dateRequested} date needed: ${request.dateNeeded} done: ${request.done}`);
    }

    const mutation = useBackendMutation(
        objectToAxiosPutParams,
        { onSuccess },
        // Stryker disable next-line all : hard to set up test for caching
        [`/api/recommendationrequest?id=${id}`]
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
                <h1>Edit Recommendation Request</h1>
                {
                    request && <RecommendationRequestForm submitAction={onSubmit} buttonLabel={"Update"} initialContents={request} />
                }
            </div>
        </BasicLayout>
    );

}
