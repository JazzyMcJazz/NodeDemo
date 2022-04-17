<script>
    import AuthRequired from "../Auth/AuthRequired.svelte";
    import {getBasket, jwtToken} from "../../stores/cookie-store";
    import ConfirmPurchaseButton from "../../components/Buttons/ConfirmPurchaseButton.svelte";
    import {base_url} from "../../stores/general-store";
    import {navigate} from "svelte-navigator";

    let isAuthenticated = !!$jwtToken;

    let cardNumber;
    function handleCardNumberChange() {
        let t = cardNumber.split('');
        t = t.filter(char => {
           let i = Number.parseInt(char);
           if (!isNaN(i))
               return i;
        });

        let s = ''
        for (let i = 0; i < t.length; i++) {
            if (i >= 16) break;
            s += t[i];
        }

        cardNumber = s;
    }

    const thisYear = new Date().getFullYear();
    const months = ['01', '02', '03', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    const years = [];
    for (let i = thisYear; i < thisYear+10; i++)
        years.push(i.toString());

    let cardHolder;
    let month;
    let year;
    let cvv;



    async function handlePurchase() {
        const response = await fetch(`${$base_url}/purchase`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                paymentInfo: {
                    cardNumber,
                    cardHolder,
                    expires: `${month}/${year}`,
                    cvv,
                },
                courses: getBasket(),
            }),
        });

        // TODO: add error handling
        // TODO: stop user from hitting the confirmation button multiple times
        // TODO: make a proper purchase confirmation screen

        navigate('/profile'); // lazy initial solution.

    }

</script>

{#if !isAuthenticated}
    <AuthRequired/>
{:else }
     <div class="content">
         <h3>Payment Information</h3>
         <form>
             <label for="card-number">Card Number</label>
             <input id="card-number" type="text" bind:value={cardNumber} on:input={handleCardNumberChange} placeholder="1234 5678 1234 5678">

             <label for="cardholder">Card Holder</label>
             <input id="cardholder" placeholder="Full name">

             <div class="flex">
                 <div>
                     <label for="date">Expires</label>
                     <select id="date" type="submit" >
                         {#each months as month}
                             <option>{month}</option>
                         {/each}
                     </select>
                     <select id="year">
                         {#each years as year}
                             <option>{year}</option>
                         {/each}
                     </select>
                 </div>
                 <div>
                     <label for="cvv">CVV</label>
                     <input id="cvv" class="cvv" type="number" placeholder="123" bind:value={cvv}/>
                 </div>
             </div>
             <br/>
             <ConfirmPurchaseButton onclick={handlePurchase}/>
         </form>
     </div>
{/if}

<style>
    .content {
        width: fit-content;
        text-align: left;
        margin: 0 auto;
    }

    .flex {
        display: flex;
    }

    .flex div {
        margin-right: 10px;
    }

    .cvv {
        width: 75px;
    }
</style>