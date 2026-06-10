// Pl@ntNet API key. Free tier = 500 identifications/day (https://my.plantnet.org/).
//
// NOTE: shipping a key inside a mobile app means it can be extracted by anyone who
// decompiles the build. Fine for a hackathon demo. For a public release, move the
// call behind a small server (the Python backend in ../../plantdex/backend does this)
// and have the app talk to that instead.
export const PLANTNET_API_KEY = '2b10frH5dr0iLml7TaDVMuBI3u'
