import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import Modal from 'react-modal';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import './Home.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

Modal.setAppElement('#root');



function Home() {

    const location = useLocation();
    const { email, userId } = location.state; // to find email

    const [balance, setBalance] = useState(0); // to display balance

    const [newExpense, setNewExpense] = useState({ category: 'Food', cost: '', date: '2024-07-17 00:00:00.0000000', CardType: '' }); // to store expense
    const [newIncome, setNewIncome] = useState({ amount: '', date: '', CardType: '' }); // to store income

    const [transactions, setTransactions] = useState([]); // to display each row

    const [showModal, setShowModal] = useState(false);
    const [showIncomeModal, setShowIncomeModal] = useState(false);

    const navigate = useNavigate(); // for navigation purposes

    const [categories, setCategories] = useState([]);


    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [chartData, setChartData] = useState(null);


    const [currentPage, setCurrentPage] = useState(1); // current page
    const [totalPages, setTotalPages] = useState(1); // total page

    const pageSize = 5;



    const handleOpenPopup = () => {
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };







    const handlePopupSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`https://localhost:7172/api/Expense/GetExpensesByMonthYear?userId=${userId}&month=${month}&year=${year}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'accept': '*/*',
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('API Response Data:', data); 
                const chartData = {
                    labels: data.map(expense => expense.category),
                    datasets: [
                        {
                            label: 'Expenses',
                            data: data.map(expense => expense.amount),
                            backgroundColor: 'rgba(75, 192, 192, 0.6)',
                        },
                    ],
                };

                setChartData(chartData);
            }
            else {
                console.error('Failed to fetch expenses');
            }

        }
        catch (error) {
            console.log(error.message);
        }

        //handleClosePopup();
    }




    

    const fetchCategories = async () => {
        try {
            const response = await fetch('https://localhost:7172/api/Category');
            const data = await response.json();

            setCategories(data);
        }
        catch (error) {
            console.log(error.message);
        }
    }

    useEffect(() => {
        fetchCategories();
    });


    const handleAddExpense = () => {
        setShowModal(true);
    };

    const handleCloseModel = () => {
        setShowModal(false);
        setNewExpense({ category: 'Food', cost: '', date: '', CardType: '' });
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewExpense((prevExpense) => ({
            ...prevExpense,
            [name]:value,
        }))
    }



    const handleAddIncome = () => {
        setShowIncomeModal(true);
    };

    const handleCloseIncomeModal = () => {
        setShowIncomeModal(false);
        setNewIncome({ amount: '', date: '', CardType: '' });
    };

    const handleIncomeChange = (e) => {
        const { name, value } = e.target;
        setNewIncome((prevIncome) => ({
            ...prevIncome,
            [name]: value,
        }));
    };



    useEffect(() => {
        const fetchData = async () => {
            try {

                console.log(email);
                const balanceResponse = await fetch(`https://localhost:7172/api/Balance?UserId=${userId}`, {
                        method: 'GET',
                        headers: {
                            accept: '*/*',
                        },
                    });

                const balanceData = await balanceResponse.json();

                if (balanceData.balance == 0) {
                    return;
                }

                const incomeResponse = await fetch(`https://localhost:7172/Api/Income?UserId=${userId}`, {
                        method: 'GET',
                        headers: {
                            accept: '*/*',
                        },
                    });

                const expenseResponse = await fetch(`https://localhost:7172/api/Expense?UserId=${userId}`, {
                        method: 'GET',
                        headers: {
                            accept: '*/*',
                        },
                    });

                    
                    const expenseData = await expenseResponse.json();
                    const incomeData = await incomeResponse.json();

                    const incomeDataWithCategory = incomeData.map(income => ({
                        ...income,
                        category: 'Income'
                    }));

                    console.log("Balance Response", balanceResponse);
                    console.log("Expense Response", expenseResponse);
                    console.log("Income Response", incomeResponse);

                    const allTransactions = [...expenseData, ...incomeDataWithCategory];

                    console.log("Transactions", allTransactions);

                setTransactions(allTransactions);
                setTotalPages(Math.ceil(allTransactions.length / pageSize));

                    setBalance(balanceData);

                    //setIncome(incomeData.income);
                
            }
            catch (error) {
                console.log(error.message);
            }
        }

        fetchData();
    }, [userId]);




    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newExpense.cost > balance) {
            alert('Insufficient Balance');
            return;
        }

        try {
            const response = await fetch('https://localhost:7172/api/Expense', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'accept': '*/*',
                },
                body: JSON.stringify({ ...newExpense, email, userId }),
            });

            console.log(response);

            const expenseResponse = await response.json();
            setTransactions(prevTransactions => [...prevTransactions, expenseResponse]);
            setBalance(prevBalance => prevBalance - expenseResponse.cost);

            handleCloseModel();
        }
        catch (error) {
            console.error(error.message);
        }
    }

    const handleIncomeSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('https://localhost:7172/Api/Income', {
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/json',
                    'accept': '*/*',
                },
                body: JSON.stringify({ ...newIncome, email, userId })
            });

            console.log(response);

            const incomeResponse = await response.json();
            incomeResponse.category = 'Income';
            setTransactions(prevTransactions => [...prevTransactions, incomeResponse]);
            setBalance(prevBalance => prevBalance + incomeResponse.amount);

            handleCloseIncomeModal();

        }
        catch (error) {
            console.log(error.message);
        }
    }



    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const displayedTransactions = transactions.slice((currentPage - 1) * pageSize, currentPage * pageSize);





    return (

        <div className="home-container">

            <div className="upper-section">

                <div className="card">

                    <div className="balance">

                        <h2>${balance} USD</h2>
                        <p>Current Balance</p>
                        

                    </div>
                    
                </div>

                

                {/*
                    <div className="income">

                    <h2>Income,</h2>
                    <p>{income}</p>
                    
                </div>    
                */ }

                

            </div>

            <div className="lower-section">

                <div className="actions">

                    <button onClick={handleAddExpense}>Add Expense</button>
                    <button onClick={handleAddIncome}>Add Income</button>
                    <button onClick={handleOpenPopup}>Statistics</button>

                </div>

                <Modal isOpen={isPopupOpen} onRequestClose={handleClosePopup} className="chart">
                    <form onSubmit={handlePopupSubmit}>
                        <div>
                            
                            <input
                                type="number"
                                value={month}
                                placeholder="Month e.g 07"
                                onChange={(e) => setMonth(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <input
                                type="number"
                                value={year}
                                placeholder="Year e.g 2024"
                                onChange={(e) => setYear(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit">Submit</button>
                    </form>
                    {chartData && <Bar data={chartData} />}
                </Modal>
                

                <div className="transactions">

                    {
                        displayedTransactions.map((transaction, index) => (
                            <div className="transactions-row" key={index}>

                                <div className="transaction-category">{transaction.category}</div>
                                <div className="transaction-type">{transaction.cardType}</div>
                                <div className="transaction-amount">${transaction.amount}{transaction.cost}</div>
                                <div className="transaction-date">{transaction.date}</div>
                                
                            </div>
                        ))
                    }

                </div>


                <div className="pagination">
                    {
                        [...Array(totalPages)].map((_, index) => 
                        (
                            <button
                                key={index}
                                onClick={() => handlePageChange(index + 1)}
                                className={currentPage === index+1 ? 'active' : ''}
                            >
                                {index+1}
                            </button>
                        )
                        )
                    }
                </div>
                

            </div>

            {showModal && (

                <div className="modal-overlay">

                    <div className="modal">

                        <form onSubmit={handleSubmit}>

                            <select
                                name="category"
                                value={newExpense.category}
                                onChange={handleChange}
                                required
                            >
                                {categories.map((category) => (
                                    <option key={category.id} value={category.name}>
                                        {category.name}
                                    </option>
                                )) }
                            </select>

                            <input
                                type="number"
                                name="cost"
                                value={newExpense.cost}
                                onChange={handleChange}
                                placeholder="Amount"
                                required
                            />
                            <input
                                type="datetime-local"
                                name="date"
                                value={newExpense.date}
                                onChange={handleChange}
                                required
                            />
                            <select
                                name="cardType"
                                value={newExpense.CardType}
                                onChange={handleChange}
                                required
                            >
                                
                                <option value="Debit">Debit</option>

                            </select>

                            <button type="submit">Submit</button>

                        </form>

                        <button onClick={handleCloseModel}>Close</button>
                    </div>
                </div>
            )}









            {showIncomeModal && (

                <div className="modal-overlay">

                    <div className="modal">

                        <form onSubmit={handleIncomeSubmit}>

                            <input
                                type="number"
                                name="amount"
                                value={newIncome.amount}
                                onChange={handleIncomeChange}
                                placeholder="Amount"
                                required
                            />
                            <input
                                type="datetime-local"
                                name="date"
                                value={newIncome.date}
                                onChange={handleIncomeChange}
                                required
                            />
                            <select
                                name="cardType"
                                value={newIncome.CardType}
                                onChange={handleIncomeChange}
                                required
                            >
                                <option value="Credit">Credit</option>
                                
                            </select>

                            <button type="submit">Submit</button>

                        </form>

                        <button onClick={handleCloseIncomeModal}>Close</button>
                    </div>
                </div>
            )}


        </div>
        
  );
}

export default Home;