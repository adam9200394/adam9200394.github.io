import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import jpg from '../images/nature-logo.png';
import jpg2 from '../images/imagel.jpg';
import jpg3 from '../images/images.png';
import jpg4 from '../images/illustration-logo.png';
import jpg5 from '../images/BMW_logo.png';
import logo1 from '../images/adopei.jpg';
import logo2 from '../images/photoshop.png';
import logo3 from '../images/blender.png';
import logo4 from '../images/aftereffects.jpg';
function Body () {
   
    
    return(
        <div className="body">
            <div className="about-us">
                <h3 className="title-txt"> about us</h3>
                <h5 className="subtitle-txt">we are: </h5>
                <div className="employ">
					<img src={jpg} className="emp-img"/>
					<div className="info">
						<p><span>name</span> : ahmed alfatih alsadig</p>
						<p><span>email</span> : ahmedcontrol57@gmail.com</p>
						<p><span> job title </span> : graphic designer</p>
						<p><span> software skills </span></p>
						<div className="software">
							<img src={logo1} className="logo-img" />
							<img src={logo4} className="logo-img"/>
							<img src={logo3} className="logo-img"/>
							<img src={logo2} className="logo-img"/>
						</div>
						
					</div>
				</div>
                <div className="employ">
					<img src={jpg} className="emp-img" />
					<div className="info">
						<p><span>name</span> : abd Almoneam shampol</p>
						<p><span>email</span> : shampol@gmail.com</p>
						<p><span> job title </span> : content creator </p>
						<p><span>  skills </span></p>
						<p><span>  exprenice </span></p>
						<p><span>  previous work </span></p> <a> link to paragraph</a>
						
						
						
					</div>
				</div>
            </div>
            <div className="our-work ">
                <h3 className="title-txt"> our work</h3> 
              
                <Carousel >
					<div>
						<img src={jpg} onClick={() => console.log("image 1")} />
						<p className="legend logo-img"> illustration</p>
					</div>
               		 <div>
						<img src={jpg2}  />
						<p className="legend logo-img">company logo 1</p>
                	</div>
					<div>
					<img src={jpg3}  />
						<p className="legend logo-img">company logo 2</p>
					</div>
					<div>
					<img src={jpg4}  />
						<p className="legend logo-img">company logo 4</p>
					</div>
					<div>
					<img src={jpg5}  />
						<p className="legend logo-img">company logo 5</p>
					</div>
            </Carousel>
            </div>
        
        </div>
    )
}
export default Body;