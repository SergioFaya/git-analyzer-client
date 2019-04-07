import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import PieChartContributionsVM from '../../models/PieChartContributionsVM';
import { ChartService } from '../../services/ChartService/chart.service';
import { DataService } from '../../services/DisplayEvents/display-data.service';

@Component({
	selector: 'app-repo-details',
	templateUrl: './repo-details.component.html',
	styleUrls: ['./repo-details.component.scss']
})
export class RepoDetailsComponent implements OnInit, AfterViewInit, OnDestroy {

	// como el document.getelementbyid de angular
	// como el document.getelementbyid de angular
	@ViewChild('commits')
	private canvasCommits!: ElementRef;
	@ViewChild('added')
	private canvasAdded!: ElementRef;
	@ViewChild('removed')
	private canvasRemoved!: ElementRef;

	private chartCommits!: Chart;
	private chartAddedLines!: Chart;
	private chartRemovedLines!: Chart;

	public repo: any;
	public contributions!: Array<PieChartContributionsVM>;
	private labelsPre: any = [];

	private colors = Array<string>();
	private dataPre: any = [];
	private insertedLines: any = [];
	private removedLines: any = [];
	public loading: boolean = false;

	constructor(private dataService: DataService, private chartService: ChartService) {
		this.loading = true;
	}

	// Somewhere under the class constructor we want to wait for our view
	// to initialize
	ngAfterViewInit() {
	}

	// change get elemet by id por tag #canvas
	ngOnInit() {
		this.colors = [];
		let i = 0;
		while (i < 15) {
			this.colors.push(this.getRandomColor());
			i++;
		}
		this.dataService.repo.subscribe((repo) => {
			this.repo = repo;
			this.getContributorsForCharts(this.repo.full_name);
		});
	}

	ngOnDestroy(): void {
		this.chartCommits.destroy();
		this.chartAddedLines.destroy();
		this.chartRemovedLines.destroy();
	}

	/**
	 * Represents a chart with the desired data and colors on the referencied element
	 * @param canvas ElementRef to the canvas where the chart is inserted
	 * @param dataSet Set of data to be represented
	 * @param colors Color assigned to each data set
	 * @param label label displayed
	 * @param text text of the title charts
	 */
	representChart(canvas: ElementRef, dataSet: Array<number>, colors: Array<string>, labels: Array<string>, text: string) {
		const context: CanvasRenderingContext2D = (<HTMLCanvasElement>canvas.nativeElement).getContext('2d') as CanvasRenderingContext2D;
		return new Chart(context, {
			type: 'pie',
			data: {
				labels: labels,
				datasets: [{
					// label: label,
					data: dataSet,
					backgroundColor: colors,
					borderWidth: 1,
				}]
			},
			options: {
				responsive: false,
				title: {
					display: true,
					text: text
				}
			}
		});
	}

	private getRandomColor(): string {
		const r = Math.floor(Math.random() * 200);
		const g = Math.floor(Math.random() * 200);
		const b = Math.floor(Math.random() * 200);
		return 'rgb(' + r + ', ' + g + ', ' + b + ')';
	}

	getContributorsForCharts(reponame: string) {
		this.chartService.getContributorsForPieChart(reponame)
			.then((result) => {
				this.loading = false;
				this.contributions = result.contributionsVM as Array<PieChartContributionsVM>;
				this.contributions.map((contrib: PieChartContributionsVM) => {
					this.dataPre.push(contrib.modifications.c);
					this.insertedLines.push(contrib.modifications.a);
					this.removedLines.push(contrib.modifications.d);
					this.labelsPre.push(contrib.login);
				});
			}).then(() => {
				// PIE CHARTS
				this.chartCommits = this.representChart(this.canvasCommits, this.dataPre, this.colors, this.labelsPre, '# of commits');
				this.chartAddedLines = this.representChart(this.canvasAdded, this.insertedLines, this.colors, this.labelsPre, '# of added lines');
				this.chartRemovedLines =
					this.representChart(this.canvasRemoved, this.removedLines, this.colors, this.labelsPre, '# of removed lines');
			})
			.catch((err) => {
				console.log(err);
			});
	}
}
