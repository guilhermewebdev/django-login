import * as React from 'react';
import { useForm } from 'react-hook-form';
import Background from './background';

export default (props: any) => {
    const { title, csrfToken, form } = props;
    const { register, handleSubmit, errors } = useForm();
    const [state, setState] = React.useState({
        username: form?.username?.value
    })
    return (
        <>
            <Background />
            <div className="container-base">
                <div className="row h-100">
                    <div className="col-12 col-sm-11 col-md-7 col-lg-5 col-xl-4 h-100 d-flex mx-auto align-items-center">
                        <form
                            method="post"
                            autoCorrect="off"
                            onSubmit={handleSubmit((data, e) => e?.target.submit())}
                            className="container-fluid paper p-5"
                        >
                            <input type="hidden" name="csrfmiddlewaretoken" value={csrfToken} />
                            <div className="row">
                                <h4 className="col-12 text-center">
                                    {title}
                                </h4>
                            </div>
                            {!!form?.erros?.__all__ &&
                                <div className="row">
                                    {form?.erros.__all__.map((item: any) => (
                                        <p className="col-12 text-center">
                                            {item.message}
                                        </p>
                                    ))}
                                </div>
                            }
                            <div className="row">
                                <input
                                    type="text"
                                    placeholder="Username"
                                    ref={register({
                                        required: true,
                                    })}
                                    autoFocus
                                    autoComplete="username"
                                    name="username"
                                    onInput={(event) => setState({
                                        ...state,
                                        username: event.target.value,
                                    })}
                                    value={state.username}
                                    className="col-12 my-1 input"
                                />
                                {form?.erros?.username?.map((item: any) => (
                                    <p className="col-12 text-center">{item.message}</p>
                                ))}
                                {errors.username && (<p className="col-12 text-center">This field is required</p>)}
                            </div>
                            <div className="row">
                                <input
                                    type="password"
                                    name="password"
                                    ref={register({
                                        required: true,
                                    })}
                                    placeholder="Password"
                                    autoComplete="password"
                                    className="col-12 my-1 input"
                                />
                                {form?.erros?.password?.map((item: any) => (
                                    <p className="col-12 text-center">{item.message}</p>
                                ))}
                                {errors.password && (<p className="col-12 text-center">This field is required</p>)}
                            </div>
                            <div className="row">
                                <div className="col-12 my-1 d-flex justify-content-center">
                                    <button type="submit" className="button bg-blue">Login</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}