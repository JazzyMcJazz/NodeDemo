<script>
    import {base_url} from "../../stores/general-store";
    import {jwtToken} from "../../stores/cookie-store";

    // block page load until it's been verified user is logged out
    let isAuth = true;
    $jwtToken ? window.location.assign('/') : isAuth = false;

    let isLogin = true;
    let email = '';
    let password = '';

    let is401 = false;
    let message = '';

    const authenticate = async () => {
        const action = isLogin ? 'login' : 'signup';

        const response = await fetch(`${$base_url}/auth/${action}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            is401 = true;
            console.log(response)
            message = data.message ? data.message : response.statusText;
            return;
        }

        window.location.assign('/');
    }

</script>
{#if !isAuth}
    <div class="container">
        <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
        {#if is401}
            <p class="error-message">{message}</p>
        {/if}
        <form on:submit|preventDefault={authenticate}>
            <input type="text" required placeholder="Email" bind:value={email}/>
            <input type="password" required placeholder="Password" bind:value={password}/>
            <br/>
            <button type="submit">{isLogin ? 'Login' : 'Create Account'}</button>
        </form>
        <div>or <a on:click={() => isLogin = !isLogin}>{isLogin ? 'create account' : 'login'}</a></div>
    </div>
{/if}

<style>
    .container {
        text-align: center;
    }

    .error-message {
        color: #FF0000;
    }

</style>