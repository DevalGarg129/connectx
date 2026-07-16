const socketAsyncHandler = (handler) => {
    return async (...args) => {
        try{
            await handler(...args);
        }catch(error){
            console.error("Socket Error : ", error);
        }
    }
};