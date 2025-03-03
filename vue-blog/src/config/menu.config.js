export default {
    index: [
        {
            component: "Edit",
            link: "/write"
        },
    ],
    article: [
        {
            component: "Star",
            activeComponent: "StarFilled",
            handler: "postLike",
            active: true
        },
        {
            component: "Comment",
            handler: "turnToComment"
        }
    ],
    category: [
        {
            component: "Plus",
            handler: "postCategory"
        }
    ],
    shootgame: [
        {
            component: "DArrowLeft",
            handler: "backToIndex"
        }
    ],
    automedia: [
        {
            component: "DArrowLeft",
            handler: "backToIndex"
        }
    ],
}