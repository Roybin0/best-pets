import { rest } from "msw";

const baseURL = "https://bestpets-api.herokuapp.com/";

export const handlers = [
    rest.get(`${baseURL}dj-rest-auth/user/`, (req, res, ctx) => {
        return res(
            ctx.json({
                "pk": 2,
                "username": "Adam87",
                "email": "",
                "first_name": "",
                "last_name": "",
                "profile_id": 2,
                "profile_image": "https://res.cloudinary.com/dzo1ed9bg/image/upload/v1/media/../default_profile_cjqose"
            })
        );
    }),
    rest.post(`${baseURL}dj-rest-auth/logout/`, (req, res, ctx) => {
        return res(ctx.status(200));
    })
];