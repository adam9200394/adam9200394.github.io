
function Footer ()  {
    const submit = (e) =>{
        e.preventDefualt();
    }
    return(
        <div className="footer">
            <h3>contact us</h3>
            <form method="POST">
                <input name="contact" id="contact" type="text" />
                <input name="submit" id="submit" type="submit" onSubmit={(e) => {submit(e)}}/>
            </form>
        </div>
    )
}

export default Footer;