import * as React from 'react';

export default (props: any) => {
    const { title } = props;
    return (
        <div className="container h-100">
            <div className="row align-items-center h-100">
                <div className="col-6 mx-auto">
                    <div className="container-fluid">
                        <div className="row">
                            <h4 className="text-center col-12">{title}</h4>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <form className="container">

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}