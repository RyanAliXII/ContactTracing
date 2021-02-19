import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { IoArrowBackCircleSharp } from 'react-icons/io5'
import { Redirect } from 'react-router-dom'
import { ReportsNavigationContext } from '../../Contexts/ReportNavigationContext'
function Reports({setLoadingClass}) {

    const [reports, setReports] = useState([]);
    const [reportsNavState, setReportsNavState] = useContext(ReportsNavigationContext);
    useEffect(() => {
        let isMount = true;

        async function fetchReports() {
            setLoadingClass('loading-wrapper')
            const { data } = await axios.post('http://localhost:5000/admin/reports', {})
            setLoadingClass('hide')
            if (isMount) {
                setReports(data)
            }
        }
        fetchReports();
        return () => {
            isMount = false;
        }
    }, [])



    if (!reportsNavState) {
        return <Redirect to='/admin' />
    }
    return (
        JSON.parse(localStorage.getItem('auth')).bool && JSON.parse(localStorage.getItem('auth')).role === "Admin" ? (
            <div className="reports">
                <div className="title-wrapper">
                    <span className="title-text">Reports</span>
                    <span className="back-btn" onClick={() => {
                        setReportsNavState(false)
                    }}><IoArrowBackCircleSharp></IoArrowBackCircleSharp></span>
                </div>
                <div className="all-reports">
                    <ul>
                        {
                            reports.map((report, index) => {
                                return <Report report={report} key={index}></Report>
                            })
                        }
                    </ul>
                </div>
            </div>
        ) : (<Redirect to='/dashboard'></Redirect>)
    );
}


function Report({ report }) {

    return (
        <li>
            <details>
                <summary className="report-summary">{`${report.reporter} reported an activity`}</summary>
                <p className="summary-text warn">{report.reportText}</p>
            </details>
        </li>
    )
}
export default Reports;