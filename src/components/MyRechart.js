import React from 'react'
import {
    PieChart, Pie, Cell
  } from 'recharts';

function MyReChart(){
    return(
        <>
            <PieChart
                width={200} 
                height={200}
            >
                <Pie
                    data={data}
                    cx={100}
                    cy={100}
                    lSabelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {
                        data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
                    }
                </Pie>
            </PieChart>
        </>
    )
}

export default MyReChart;