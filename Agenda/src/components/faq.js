import React from 'react';

export default () => {
  return(
    <div className = "container" >
      <div className="row">
        <div className="section-title item_bottom text-center" style={{
          opacity: `1`,
          bottom: `0px`,
        }}>
          <div>
            <span className="fa fa-cogs fa-2x"></span>
          </div>
          <h1 className="white">Perguntas&<span>Respostas</span>
          </h1>
        </div>

        <div className="col-lg-6 col-md-6 col-sm-12">
          <h2 className="faqh">Pedidos</h2>

          <div className="panel-group" id="accordion-1">
            <div className="panel panel-default">
              <div className="panel-heading">
                <h4 className="panel-title">
                  <a data-toggle="collapse" data-parent="#accordion-1" href="#collapseOne" className="">
                    About Costing
                  </a>
                </h4>
              </div>
              <div id="collapseOne" className="panel-collapse collapse" style={{height: `0px`,}}>
                <div className="panel-body">
                  <ul className="list-group">
                    <li className="list-group-item">No capital expense
                    </li>
                    <li className="list-group-item">No operations cost</li>
                    <li className="list-group-item">Up to 60% cost savings when compared to current offshore costs</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="panel panel-default">
              <div className="panel-heading">
                <h4 className="panel-title">
                  <a data-toggle="collapse" data-parent="#accordion-1" href="#collapseTwo" className="">
                    How we operate?
                  </a>
                </h4>
              </div>
              <div id="collapseTwo" className="panel-collapse collapse" style={{height: `0px`,}}>
                <div className="panel-body">
                  <ul className="list-group">
                    <li className="list-group-item">Robust process.
                    </li>
                    <li className="list-group-item">Flexible model</li>
                    <li className="list-group-item">Transparent operations</li>

                  </ul>
                </div>
              </div>
            </div>
            <div className="panel panel-default">
              <div className="panel-heading">
                <h4 className="panel-title">
                  <a data-toggle="collapse" data-parent="#accordion-1" href="#collapseThree" className="">
                    Team work
                  </a>
                </h4>
              </div>
              <div id="collapseThree" className="panel-collapse collapse" style={{height: `0px`,}}>
                <div className="panel-body">
                  <ul className="list-group">
                    <li className="list-group-item">Work single project at a time</li>
                    <li className="list-group-item">Availability of resources with skills hard to find locally</li>
                    <li className="list-group-item">Low employee attrition.</li>
                    <li className="list-group-item">Employees with previous experience in working directly
                      <br/>
                      with international (UK, US &amp; EU) clients</li>
                    <li className="list-group-item">Complete management control over your dedicated resources.
                    </li>
                    <li className="list-group-item">Our engagement model allows you to treat and manage your
                      <br/>resources as your own employees</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="panel panel-default">
              <div className="panel-heading">
                <h4 className="panel-title">
                  <a data-toggle="collapse" data-parent="#accordion-1" href="#collapsefour" className="collapsed">
                    Quality Assurance
                  </a>
                </h4>
              </div>
              <div id="collapsefour" className="panel-collapse collapse">
                <div className="panel-body">
                  <ul className="list-group">
                    <li className="list-group-item">As client has direct control over output or result of candidate,
                      <br/>
                      quality will be maintained as per standards at client end.</li>
                    <li className="list-group-item">As quality people in terms of experience and skills are involved
                      <br/>quality can be better controlled as per requirements</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="panel panel-default">
              <div className="panel-heading">
                <h4 className="panel-title">
                  <a data-toggle="collapse" data-parent="#accordion-1" href="#collapsefive" className="collapsed">
                    Messages
                  </a>
                </h4>
              </div>
              <div id="collapsefive" className="panel-collapse collapse">
                <div className="panel-body">
                  <ul className="list-group">
                    <li className="list-group-item">All outsourcing deals will be strictly confidential and not disclosed to any media.</li>
                    <li className="list-group-item">NDA is signed.</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="panel panel-default">
              <div className="panel-heading">
                <h4 className="panel-title">
                  <a data-toggle="collapse" data-parent="#accordion-1" href="#collapsesix" className="collapsed">
                    Anything More?
                  </a>
                </h4>
              </div>
              <div id="collapsesix" className="panel-collapse collapse">
                <div className="panel-body">
                  <li className="list-group-item">Candidate is dedicated for single client and so can give 100% time and
                    <br/>attention to a client company. This avoids delays in the work output.</li>
                  <li className="list-group-item">Easy agreement process and terms.
                  </li>
                  <li className="list-group-item">Free from legal issues.</li>
                  <li className="list-group-item">We provide pilot program of 2 months before large duration contract.</li>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6 col-md-6 col-sm-12">
          <h2 className="faqh">Agenda</h2>
          <div className="panel-group" id="accordion-2">
            <div className="panel panel-default">
              <div className="panel-heading">
                <h4 className="panel-title">
                  <a data-toggle="collapse" data-parent="#accordion-2" href="#one" className="">
                    Why I need to
                  </a>
                </h4>
              </div>
              <div id="one" className="panel-collapse in" style={{height: `auto`,}}>
                <div className="panel-body">
                  <ul className="list-group">
                    <li className="list-group-item">Cost benefits.</li>
                    <li className="list-group-item">You can concentrate more on to increase customer base or other core business process.

                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="panel panel-default">
              <div className="panel-heading">
                <h4 className="panel-title">
                  <a data-toggle="collapse" data-parent="#accordion-2" href="#Two" className="collapsed">
                    How much needed
                  </a>
                </h4>
              </div>
              <div id="Two" className="panel-collapse collapse" style={{height: `0px`,}}>
                <div className="panel-body">
                  <ul className="list-group">
                    <li className="list-group-item">You can hire candidate for minimum of 4 months. But pilot program can be run for 1 month.</li>

                  </ul>
                </div>
              </div>
            </div>
            <div className="panel panel-default">
              <div className="panel-heading">
                <h4 className="panel-title">
                  <a data-toggle="collapse" data-parent="#accordion-2" href="#Three" className="collapsed">
                    Is our service cost effective and qualified?
                  </a>
                </h4>
              </div>
              <div id="Three" className="panel-collapse collapse" style={{height: `0px`,}}>
                <div className="panel-body">
                  <ul className="list-group">
                    <li className="list-group-item">1. Yes! Our service is about 40% less costly compared to existing outsourcing service providers. You can hire 3 years experience person in general skills at an average cost of USD 1800$ per month.</li>

                  </ul>
                </div>
              </div>
            </div>
            <div className="panel panel-default">
              <div className="panel-heading">
                <h4 className="panel-title">
                  <a data-toggle="collapse" data-parent="#accordion-2" href="#four" className="collapsed">
                    Is there project manager for each project?
                  </a>
                </h4>
              </div>
              <div id="four" className="panel-collapse collapse" style={{height: `0px`,}}>
                <div className="panel-body">
                  <ul className="list-group">
                    <li className="list-group-item">o For each outsourcing project where more than 3 resources are working, we provide dedicated project manager at free of cost. He will be in contact with client as well as have responsibility of managing entire project.
                    </li>
                    <li className="list-group-item">This project manager cost will be bearded by Nimetler Technologies.In all other cases, Nimetler in house project manager will.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="panel panel-default">
              <div className="panel-heading">
                <h4 className="panel-title">
                  <a data-toggle="collapse" data-parent="#accordion-2" href="#five" className="collapsed">
                    How you work effectively with clients?
                  </a>
                </h4>
              </div>
              <div id="five" className="panel-collapse collapse" style={{height: `0px`,}}>
                <div className="panel-body">
                  <ul className="list-group">
                    <li className="list-group-item">A dedicated or shared project manager to manage work of candidates.</li>
                    <li className="list-group-item">Use of cost-effective communication tools.</li>
                    <li className="list-group-item">Easy-to-use project management tools for instant access to the status of your project.</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="panel panel-default">
              <div className="panel-heading">
                <h4 className="panel-title">
                  <a data-toggle="collapse" data-parent="#accordion-2" href="#six">
                    Anything More?
                  </a>
                </h4>
              </div>
              <div id="six" className="panel-collapse collapse">
                <div className="panel-body">
                  <h3>If candidate not found result oriented during job what action will be taken?</h3>
                  <ul className="list-group">
                    <li className="list-group-item">If client is not satisfied with any candidates’ work he will be immediately replaced with alternate candidate.
                    </li>
                    <li className="list-group-item">Nimetler will not charge client on the day complaint is officially registered in given format. Also candidate will be asked to stop work.</li>
                    <li className="list-group-item">In the case client can’t stop work due to certain reason, but complaint has been registered, Nimetler will charge 50% of amount negotiated till new candidate is recruited.
                    </li>
                  </ul>
                  <hr/>
                  <h3>What precaution you take to tackle such situations?</h3>
                  <ul className="list-group">
                    <li className="list-group-item">During interview process we select at least 2 candidates. Out of it second person is backup resource. So work will not get affected.
                    </li>
                  </ul>
                  <hr/>

                  <h3>Who manages candidates?</h3>
                  <ul className="list-group">
                    <li className="list-group-item">As all candidates are our employees, it is our responsibility to manage them. Client need to just provide assignment and check work done.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
