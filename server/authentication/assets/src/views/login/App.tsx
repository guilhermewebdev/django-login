import * as React from 'react';

export default (props: any) => {
    const { title } = props;
    return (
        <div className="container-fluid h-100">
            <div className='row'></div>
            <div className="row h-100">
                <div className="col-12 h-100">
                    <div className="container d-flex flex-column">
                        <div className="row d-flex align-self-center flex-row justify-content-center align-items-center">
                            <div className="col-md-4">
                                <div className="container-fluid">
                                    <div className="row form-header">{title}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}