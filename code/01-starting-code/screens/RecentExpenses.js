import { useContext, useEffect, useState } from 'react';

import ExpensesOutput from '../components/ExpensesOutput/ExpensesOutput';
import ErrorOverlay from '../components/UI/ErrorOverlay';
import LoadingOverlay from '../components/UI/LoadingOverlay';
import { ExpensesContext } from '../store/expenses-context';
import { getDateMinusDays } from '../util/date';
import { getAllExpenses } from '../util/http';

function RecentExpenses() {
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState();
    const expensesCtx = useContext(ExpensesContext);
    function errorHandler() {
        setError(null);
    }
    useEffect(() => {
        async function getDBData() {
            setIsFetching(true);
            try {
                const dbResults = await getAllExpenses();
                expensesCtx.setExpenses(dbResults);
            } catch (error) {
                setIsFetching(false);
                console.log('error caught');
                setError('Could not fetch from database');
                return (
                    <ErrorOverlay message={error} onConfirm={errorHandler} />
                );
            }

            setIsFetching(false);
        }
        getDBData();
    }, []);
    if (error && !isFetching) {
        return <ErrorOverlay message={error} onConfirm={errorHandler} />;
    }
    if (isFetching) {
        return <LoadingOverlay />;
    }
    //     // return <LoadingOverlay />;
    // }
    const recentExpenses = expensesCtx.expenses.filter((expense) => {
        const today = new Date();
        const date7DaysAgo = getDateMinusDays(today, 7);

        return expense.date >= date7DaysAgo && expense.date <= today;
    });

    return (
        <ExpensesOutput
            expenses={recentExpenses}
            expensesPeriod='Last 7 Days'
            fallbackText='No expenses registered for the last 7 days.'
        />
    );
}

export default RecentExpenses;
