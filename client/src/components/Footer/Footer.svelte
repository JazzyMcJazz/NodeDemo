<script>
    import MdEmail from 'svelte-icons/md/MdEmail.svelte'
    import MdPhone from 'svelte-icons/md/MdPhone.svelte'
    import MdWatchLater from 'svelte-icons/md/MdWatchLater.svelte'
</script>

<footer>
    <div class="grid-box">
        <table>
            <thead>
            <tr>
                <th>Contact</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>
                    <div class="footer-icon"><MdEmail/></div>
                    keastore@riel.expert
                </td>
            </tr>
            <tr>
                <td>
                    <div class="footer-icon"><MdPhone/></div>
                    +45 1234 5678
                </td>
            </tr>
            </tbody>
        </table>
    </div>

    <div class="grid-box">
        <table>
            <thead>
            <tr>
                <th colSpan="2">Opening Hours</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>
                    <div class="footer-icon"><MdWatchLater/></div>
                    <div>Mon-Fri:</div>
                </td>
                <td>10-18</td>
            </tr>
            <tr>
                <td>
                    <div class="footer-icon"></div>
                    <div>Sat:</div>
                </td>
                <td>10-16</td>
            </tr>
            <tr>
                <td>
                    <div class="footer-icon"></div>
                    <div>Sun:</div>
                </td>
                <td>Closed</td>
            </tr>
            </tbody>
        </table>
    </div>
    <div class="full-width">©{new Date().getFullYear()} Kea Store</div>
</footer>

<style>
    footer {
        background-color: #383838;
        height: 180px;
        display: grid;
        grid-template-columns: 50% 50%;
        color: white;
        font-size: 0.85em;
    }

    .footer-icon {
        height: 16px;
        width: 16px;
        margin-right: 5px;
    }

    .grid-box {
        display: flex;
        justify-content: center;
        margin-top: 30px;
    }

    table {
        text-align: left;
    }

    tr, td {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .full-width {
        grid-column: span 2;
        text-align: center;
    }
</style>