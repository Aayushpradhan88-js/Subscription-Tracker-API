import aj from "../config/arcjet";

const arcjectMiddleware = async(req, res,next) => {
    try {
        const decision = await aj.protect()

        if(decision.isDenied()){
            if(decision.reason.isRateLimit()) return res.status(429).json({message: "Too Many Requests"});

            if(decision.reason.isBot()) return res.status(403).json({message: "Bot Detected"});
        }

        next();

    } catch (error) {
        console.log(error);
        next(error);
    }
}

export default arcjectMiddleware;