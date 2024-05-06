import { Button, Form, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

function RecommendationRequestForm({initialContents, submitAction, buttonLabel = "Create"}){
    // Stryker disable all
    const{
        register,
        formState: {errors},
        handleSubmit
    } = useForm(
        {defaultValues: initialContents || {},}
    );
    // Stryker restore all


    const navigate = useNavigate();
    // Stryker disable next-line Regex
    const date_regex = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)/i;
    // Stryker disable next-line all
    const email_regex = /(\w)+@(\w)+\.(\w)+/i;

    return (
        <Form onSubmit={handleSubmit(submitAction)}>
            <Row>
                {initialContents && (
                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="id">Id</Form.Label>
                            <Form.Control
                                data-testid="RecommendationRequestForm-id"
                                id="id"
                                type="text"
                                {...register("id")}
                                value={initialContents.id}
                                disabled
                            />
                        </Form.Group>
                    </Col>
                )}

                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="requesterEmail">Requester Email</Form.Label>
                        <Form.Control
                            data-testid="RecommendationRequestForm-requesterEmail"
                            id="requesterEmail"
                            type="text"
                            isInvalid={Boolean(errors.requesterEmail)}
                            {...register("requesterEmail", {required: true, pattern: email_regex})}
                            />
                        <Form.Control.Feedback type="invalid">
                            {errors.requesterEmail && 'Requester Email is required. '}
                            {errors.requesterEmail?.type === 'pattern' && 'Requester Email must be email-format.'}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="professorEmail">Professor Email</Form.Label>
                        <Form.Control
                            data-testid="RecommendationRequestForm-professorEmail"
                            id="professorEmail"
                            type="text"
                            isInvalid={Boolean(errors.professorEmail)}
                            {...register("professorEmail", {required: true, pattern: email_regex})}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.professorEmail && 'Professor Email is required. '}
                            {errors.professorEmail?.type === 'pattern' && 'Professor Email must be email-format.'}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="explanation">Explanation</Form.Label>
                        <Form.Control
                            data-testid="RecommendationRequestForm-explanation"
                            id="explanation"
                            type="text"
                            isInvalid={Boolean(errors.explanation)}
                            {...register("explanation", {required:true})}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.explanation && 'Explanation is required. '}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="dateRequested">Date Requested</Form.Label>
                        <Form.Control
                            data-testid="RecommendationRequestForm-dateRequested"
                            id="dateRequested"
                            type="datetime-local"
                            isInvalid={Boolean(errors.dateRequested)}
                            {...register("dateRequested", {required: true, pattern: date_regex})}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.dateRequested && 'Date Requested is required. '}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="dateNeeded">Date Needed</Form.Label>
                        <Form.Control
                            data-testid="RecommendationRequestForm-dateNeeded"
                            id="dateNeeded"
                            type="datetime-local"
                            isInvalid={Boolean(errors.dateNeeded)}
                            {...register("dateNeeded", {required: true, pattern: date_regex})}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.dateNeeded && 'Date Needed is required. '}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="completed">Completed</Form.Label>
                        <Form.Control
                            data-testid="RecommendationRequestForm-completed"
                            id="completed"
                            type="boolean"
                            isInvalid={Boolean(errors.completed)}
                            {...register("completed", {required: true})}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.completed && 'Completed is required. '}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Button type="submit" data-testid="RecommendationRequestForm-submit">{buttonLabel}</Button>
                    <Button
                        variant="Secondary"
                        onClick={() => navigate(-1)}
                        data-testid="RecommendationRequestForm-cancel">
                        Cancel
                    </Button>
                </Col>
            </Row>
        </Form>

    );

}

export default RecommendationRequestForm;