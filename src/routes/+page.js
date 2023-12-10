export async function load({url}) {
    let authCode = url.searchParams.get("code")
    return {authCode}
}