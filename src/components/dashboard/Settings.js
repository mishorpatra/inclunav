import React from 'react';
 class Settings extends React.Component{
     render(){
         return (
           <div className="bg-settings container-fluid" style={{height:"100vh", overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#111'}}>
             <div className="text-white row mt-5 pt-2">
               <div className="col-lg-12 ">
                 <div className="text-center" id="content">
                   <button className="btn btn-dashboard btn-dashboard-text mx-auto btn-block btn-default  h2 button-text" onClick={()=>{
                     this.props.history.push('/profile-settings')
                   }} >
                     <img
                       className="float-left"
                       src="/inclunav/assets/images/user_profile.svg"
                     />
                     Profile Settings
                   </button>
                   <button
                     className="btn btn-dashboard btn-dashboard-text mx-auto btn-block btn-default h2 button-text"
                     onClick={() => {
                      this.props.history.push('/navigation-settings')
                     }}
                   >
                     <img
                       className="float-left"
                       src="/inclunav/assets/images/navigate.png"
                     />
                     Navigate
                   </button>

                   {/* <button
                     className="btn btn-dashboard btn-dashboard-text mx-auto btn-block btn-default h2 button-text"
                     onClick={() => {
                       sessionStorage.clear();
                      this.props.history.push('/')
                     }}
                   >
                     <img
                       className="float-left"
                       src="/inclunav/assets/images/navigate.png"
                     /> */}
                    <div
                       onClick={() => {
                        localStorage.clear();
                       this.props.history.push('/')
                      }}
                    > Logout </div> 
                   {/* </button> */}

                 </div>
               </div>
             </div>
           </div>
         );
     }
 }

export default Settings
