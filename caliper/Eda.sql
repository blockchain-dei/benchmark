https://www.eth-to-wei.com/

select
	contract_name, 
	sum(balance_ini-balance_end) / 1000000000000000000 balance_consumed,  
	sum(block_size_end-block_size_ini) block_size,
	sum(nro_trans_affected) nro_trans_affected,
	avg(cpu_usage) cpu_usage,
	avg(mem_end - mem_start) mem_usage,
	sum(gas_price_end) gas_price,
	(select sum(length(i.input_data)) input_data
		from bench_inputdata i
	    where i.contract_name = bench_metrics.contract_name
		group by i.contract_name),
	(select sum(length(i.storage_data)) storage_data
		from bench_storagedata i
	    where i.contract_name = bench_metrics.contract_name
		group by i.contract_name)
	
from bench_metrics
group by contract_name

select contract_name, event_name, sum(length(rawdata)) event_data
from bench_eventdata
group by contract_name, event_name


select * from bench_metrics_function 


select contract_name, function_name,erromsg, count(*) frequency  from bench_network
group by  contract_name, function_name,erromsg



 


--delete from bench_metrics;
--delete from bench_metrics_function;
--delete from bench_eventdata;
--delete from bench_metrics;
--delete from bench_network;
--delete from bench_storagedata;



 



 