export interface Vote {
    username: String,
    ipAddress: String
}

export interface PollResponse {
    response: String,
    votes: Vote[]
}

export interface Poll {
    _id?: String,
    poll_id?: Number,
    addedAt: Date,
    username: String,
    question: String,
    responses: PollResponse[]
}

export interface pollFormState {
    error: string | null
}

export interface appState {
    user: string | null,
    loading: boolean,
    pollForm: pollFormState,
    retrievedPolls: Poll[],
    registerUserError?: string;
    loginError?: string
}