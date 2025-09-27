class ApiResponse {

    static success(res, data=null, message='Request was successful', status=200){
        res.status(status).json({
            status: 'success', 
            message,
            data,
        })
    }

    static error(res, message='Something went wrong', status=500, data=null){
        res.status(status).json({
            status: 'failed',
            message,
            data
        })
    }

}

export default ApiResponse