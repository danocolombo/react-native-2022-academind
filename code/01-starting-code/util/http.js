import axios from 'axios';
const FBEndpoint =
    'https://max-react-native-expenses-default-rtdb.firebaseio.com/';

export async function storeExpense(expenseData) {
    // post for creating new db entry
    // firebase will generate unique id automatically, so don't send it
    const response = await axios.post(
        FBEndpoint + 'expenses.json',
        expenseData
    );
    //firebase uses name for the unique id.
    const id = response.data.name;
    return id;
}
export async function getAllExpenses() {
    const response = await axios.get(FBEndpoint + 'expenses.json');
    const expenses = [];
    // to see response from data before transformation, uncomment next line
    //console.log(response.data);
    for (const key in response.data) {
        // for every object returned from database...
        // NOTE: we convert the date string from db to date object to use in app
        const expenseObject = {
            id: key,
            amount: response.data[key].amount,
            date: new Date(response.data[key].date),
            description: response.data[key].description,
        };
        // now add object to array
        expenses.push(expenseObject);
    }
    return expenses;
}
export function updateExpense(id, expenseData) {
    return axios.put(FBEndpoint + `/expenses/${id}.json`, expenseData);
}
export function deleteExpense(id) {
    return axios.delete(FBEndpoint + `expenses/${id}.json`);
}
