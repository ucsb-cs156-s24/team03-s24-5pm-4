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
        <Form onSubmit={handleSubmit(submitAction)} noValidate>
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
                        {/*Thank you to stackoverflow for teaching me how to comment,
                        https://stackoverflow.com/questions/30766441/how-to-use-comments-in-react
                        and thank you to stack overflow for teaching me the as="select" modifier to get this to work
                        (I was stuck here an hour
                        https://stackoverflow.com/questions/68166687/why-isnt-form-select-recognized-in-my-simple-react-bootstrap-app-following-the*/}
                        <Form.Label htmlFor="done">Done</Form.Label>
                        <Form.Control data-testid="RecommendationRequestForm-done" id="done" as="select"
                                isInvalid={Boolean(errors.done)}
                                {...register("done", {required: true, minLength: 1 })}
                        defaultValue="">
                            <option value="">Pick a value</option>
                            <option value="true">True</option>
                            <option value="false">False</option>
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                            {errors.done && 'Done is required. '}
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