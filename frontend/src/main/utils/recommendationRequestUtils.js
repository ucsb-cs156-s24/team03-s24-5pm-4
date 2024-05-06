import { toast } from "react-toastify";

export function onDeleteSuccess(message) {
    toast(message);
}

export function cellToAxiosParamsDelete(cell) {
    return {
        url: "/api/recommendationrequest",
        method: "DELETE",
        params: {
            id: cell.row.values.id
        }
    }
}

