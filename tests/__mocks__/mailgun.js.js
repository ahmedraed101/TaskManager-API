class Mailgun {
    client() {
        return {
            messages: {
                create: () => {
                    return {}
                },
            },
        }
    }
}

module.exports = Mailgun
