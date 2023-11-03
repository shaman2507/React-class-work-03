import { Formik, Field } from 'formik';
import { StyledForm } from './QuizForm.styled';

export const QuizForm = () => {
    return (
        <Formik
            initialValues={{
                topic: '',
                time: 0,
                questions: 0,
                level: 'beginner',
            }}
            onSubmit={(values, actions) => {
                console.log(values);
                actions.resetForm();
            }}
        >
            <StyledForm>
                <label>
                    Topic
                    <Field name="topic" />
                </label>
                
                <label>
                    Time
                    <Field name="time" type="number"/>
                </label>

                <label>
                    Questions
                    <Field name="questions" type="number"/> 
                </label>
                
                <label>
                    Level
                    <Field as="select" name="level">
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                    </Field>
                </label>
                
                <button type="submit">Submit</button>
            </StyledForm>
        </Formik>
    );
};