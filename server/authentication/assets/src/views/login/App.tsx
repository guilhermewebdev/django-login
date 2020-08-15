import * as React from 'react';

export default (props: any) => {
    const { title, csrfToken } = props;
    return (
        <div className="container-base">
            <div className="row h-100">
                <div className="col-12 col-sm-11 col-md-6 col-lg-4 col-xl-4 h-100 d-flex mx-auto align-items-center">
                    <form method="post" className="container-fluid">
                        <input type="hidden" name="csrfmiddlewaretoken" value={csrfToken}/>
                        <div className="row">
                            <h4 className="col-12 text-center">
                                {title}
                            </h4>
                        </div>
                        <div className="row">
                            <input type="text" placeholder="Username" name="username" className="col-12 my-1"/>
                        </div>
                        <div className="row">
                            <input type="password" name="password" placeholder="Password" className="col-12 my-1"/>
                        </div>
                        <div className="row">
                            <div className="col-12 my-1 d-flex justify-content-center">
                                <button type="submit">Login</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}