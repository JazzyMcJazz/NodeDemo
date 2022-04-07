<script>
    import {expireCookie, getCookie, jwtToken} from "../../stores/cookie-store";
    import {onMount} from "svelte";
    import {base_url} from "../../stores/general-store";

    // block page load until login has been verified
    let isAuth = false;
    $: $jwtToken ? isAuth = true : window.location.assign('/authentication');

    let isFetched = false
    let email, role, verified, created_date, emailSent = false;
    let verification_status;

    onMount(async () => {
        const response = await fetch(`${$base_url}/users/self`);

        if (response.status !== 200) {
            expireCookie('jwt');
            jwtToken
        }

        const data = await response.json();
        const user = data.data;

        email = user.email;
        role = user.role;
        verified = user.verified;
        created_date = new Date(user.created_date).toLocaleDateString();

        isFetched = true;
    });

    async function sendEmailVerification() {
        const response = await fetch(`${$base_url}/auth/request-verification-email`);
        const data = await response.json();

        if (data.error) // only happens if user is already verified.
            window.location.reload();

        emailSent = true;
    }

    function logout() {
        expireCookie('jwt');
    }
</script>
<!-- Prevent page from loading before authentication has been verified and data has been fetched -->
{#if isAuth && isFetched}
    <div class="content">
        <table>
            <tbody>
                <tr><td>Email:</td><td>{email}</td></tr>
                <tr><td>Role:</td><td>{role}</td></tr>
                <tr><td>Email Verified:</td><td>
                    {#if verified}
                        yes
                    {:else if emailSent}
                        no | email verification sent
                    {:else}
                        no | <a on:click={sendEmailVerification}>send email verification</a>
                    {/if}
                </td></tr>
                <tr><td>Account Created:</td><td>{created_date}</td></tr>
            </tbody>
        </table>

        <button on:click={logout}>Logout</button>
    </div>
{/if}

<style>
    .content {
        text-align: center;
        margin-top: 20px;
    }

    table {
        text-align: left;
        margin: auto;
    }

    td:nth-child(odd) {
        padding-right: 10px;
    }

    button {
        margin-top: 50px;
    }
</style>