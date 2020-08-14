import * as React from 'react';

export default (props: any) => {
    const { title, csrfToken } = props;
    return (
        <div className="container h-100">
            <div className="row align-items-center h-100">
                <div className="col-6 mx-auto">
                    <div className="container-fluid">
                        <div className="row">
                            <h4 className="text-center col-12">{title}</h4>
                        </div>
                        <div className="row">
                            <div className="col-6">
                                <form method='POST' className="container" acceptCharset="utf-8">
                                    <input type="hidden" name="csrfmiddlewaretoken" value={csrfToken}/>
                                    <p className="row">
                                        <input
                                            className="col-12"
                                            type="text"
                                            autoFocus
                                            placeholder="Username"
                                            name="username"
                                        />
                                    </p>
                                    <p className="row">
                                        <input
                                            className="col-12"
                                            type="password"
                                            placeholder="Password"
                                            name="password"
                                        />
                                    </p>
                                    <p className="row">
                                        <button className="col-12" type="submit">Log in</button>
                                    </p>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}