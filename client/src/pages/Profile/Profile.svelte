<script>
    import {expireCookie, jwtToken} from "../../stores/cookie-store";
    import {onMount} from "svelte";
    import {base_url} from "../../stores/general-store";
    import {navigate} from "svelte-navigator";

    // block page load until login has been verified
    let isAuth = false;
    $: $jwtToken ? isAuth = true : navigate('/authentication');

    let isFetched = false
    let email, role, verified, created_date, emailSent = false;
    let verification_status;

    onMount(async () => {
        const response = await fetch(`${$base_url}/users/self`);

        if (response.status !== 200) {
            expireCookie('jwt');
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

        if (data.error) // should only happen if user is already verified.
            navigate('/') // lazy error handling

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
        margin: 20px 0;
        padding: 20px 0;
        background-color: white;
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